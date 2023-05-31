import sys
sys.path.append("..")

from .auth import get_current_user, get_user_exceptions
from io import BytesIO
from typing import Optional
from pydantic import BaseModel, Field
from database import get_db
import models
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import pickle
from lime.lime_text import LimeTextExplainer
import pandas as pd
import numpy as np
import spacy
import keras
import ktrain
from ktrain import text
from tensorflow.keras.utils import pad_sequences
from pandarallel import pandarallel
pandarallel.initialize(progress_bar=False)
nlp = spacy.load("en_core_web_sm")


router = APIRouter(
    prefix="/predict",
    tags=["predict"],
    responses={404: {"description": "Not found"}}
)


ALLOWED_EXTENSIONS = set(['xlsx', 'xlsm', 'xls'])


class Prediction(BaseModel):
    text: str
    model: str
    predict: Optional[str]
    feedback: Optional[str]

class Feedback(BaseModel):
    feedback: str


@router.on_event("startup")
def load_models():
    with open("app/ml_model/model_tokenizer.pkl", 'rb') as f:
        global tokenizer
        tokenizer = pickle.load(f)
    global bloom_model
    bloom_model = keras.models.load_model("app/ml_model/lstm_model")
    global max_length
    max_length = 70
    global padding_type
    padding_type = "pre"
    global trunction_type
    trunction_type="pre"
    global pance_med_model
    pance_med_model = ktrain.load_predictor('app/ml_model/pance_med')
    global labels
    labels = load_labels("blooms")
    print("_____models loaded successfully_____")


@router.post("")
async def predict_text_no_auth(prediction: Prediction, db: Session = Depends(get_db)):
    global labels
    labels = load_labels(prediction.model)
    # print(f"labels: {labels}")
    text = get_prediction(prediction.text.strip(), prediction.model)
    predict=text["class"]
    print(f"prediction: {predict}")
    predict_model = models.Predictions(
        text=prediction.text,
        predict=text["class"],
        proba=text["proba"]
    )

    db.add(predict_model)
    db.commit()
    db.refresh(predict_model)
    return succesful_response(201, predict_model)


@router.post('/user')
async def predict_text_auth(prediction: Prediction, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user is None:
        raise get_user_exceptions()
    global labels
    labels = load_labels(prediction.model)
    text = get_prediction(prediction.text.strip(),prediction.model)
    predict_model = models.Predictions()
    predict_model.text = prediction.text
    predict_model.predict = text["class"]
    predict_model.owner_id = user.get("id")
    predict_model.proba = text["proba"]

    db.add(predict_model)
    db.commit()
    db.refresh(predict_model)
    return succesful_response(201, predict_model)


@router.post('/lime')
async def get_lime_no_auth(prediction: Prediction, db: Session = Depends(get_db)):
    global labels
    labels = load_labels(prediction.model)
    lime = load_LIME(prediction.text.strip(),labels)
    return succesful_response(200, lime)


@router.post('/lime/user')
async def get_lime_auth(prediction: Prediction, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user is None:
        raise get_user_exceptions()
    global labels
    labels = load_labels(prediction.model)
    lime = load_LIME(prediction.text.strip(),labels)
    return succesful_response(200, lime)


@router.post('/file')
async def predict_batch_no_auth(file: UploadFile = File(...)):
    if file and allowed_file(file.filename):
        batch_file = BytesIO(file.file.read())
        buffer: BytesIO = predict_file(batch_file)
        global labels
        labels = load_labels("blooms")
        return StreamingResponse(
            BytesIO(buffer.getvalue()),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={"Content-Disposition": f"attachment; filename=processed_batch.xlsx"}
        )
    raise http_exception("Allowed file types are xlsx, xlsm")


@router.post('/file/user')
async def predict_batch_auth(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if user is None:
        raise get_user_exceptions()
    if file and allowed_file(file.filename):
        batch_file = BytesIO(file.file.read())
        buffer: BytesIO = predict_file(batch_file)
        global labels
        labels = load_labels("blooms")
        return StreamingResponse(
            BytesIO(buffer.getvalue()),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={"Content-Disposition": f"attachment; filename=processed_batch.xlsx"}
        )
    raise http_exception("Allowed file types are xlsx, xlsm")


@router.put('/{prediction_id}')
async def give_feedback_no_auth(prediction_id: int, f: Feedback, db: Session = Depends(get_db)):
    predict_model = db.query(models.Predictions).filter(
        models.Predictions.id == prediction_id).first()

    if predict_model is None:
        raise http_exception()

    predict_model.feedback = f.feedback

    db.add(predict_model)
    db.commit()
    db.refresh(predict_model)

    return succesful_response(201, predict_model)


@router.put('/user/{prediction_id}')
async def give_feedback_auth(prediction_id: int, f: Feedback, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user is None:
        raise get_user_exceptions()
    predict_model = db.query(models.Predictions).filter(models.Predictions.id == prediction_id).filter(
        models.Predictions.owner_id == user.get("id")).first()

    if predict_model is None:
        raise http_exception()

    predict_model.owner_id = user.get("id")
    predict_model.feedback = f.feedback

    db.add(predict_model)
    db.commit()
    db.refresh(predict_model)

    return succesful_response(201, predict_model)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def succesful_response(status_code: int, data=None):
    return {
        'status': status_code,
        'transaction': 'Succesful',
        'data': data
    }


def http_exception(message="data not found"):
    return HTTPException(status_code=404, detail=message)


def load_labels(model):
    if model == "blooms":
        labels = ['analysis', 'application', 'comprehension', 'evaluation', 'knowledge', 'synthesis']
    else:
        labels = pance_med_model.get_classes()
    return labels

def bloom_make_predictions(X_batch_text, Probability=True):
  seq = tokenizer.texts_to_sequences(X_batch_text)
  padded = pad_sequences(seq, maxlen=max_length, padding=padding_type, truncating=trunction_type)
  y_preds = bloom_model.predict(padded)
  return y_preds if Probability else [labels[np.argmax(i)] for i in y_preds]

def ktrain_make_predictions(text):
  return pance_med_model.predict(text, return_proba=True)


def get_prediction(text,model="blooms"):
    if model == "blooms":
        pred = bloom_make_predictions([extract_sentence(text)])[0].round(3)
    else:
        pred = ktrain_make_predictions(text)
    print(f"labels: {labels}")
    res = labels[np.argmax(pred)]
    return {"class":res, "proba":str(np.max(pred))}


def load_LIME(text,model="blooms"):
    text = extract_sentence(text) if model == "blooms" else text.lower()
    explainer = LimeTextExplainer(class_names=labels, verbose=True)
    explanation = explainer.explain_instance(
        text, classifier_fn=bloom_make_predictions if model == "blooms" else ktrain_make_predictions, top_labels=1, num_samples=200)
    return explanation.as_html()


def extract_sentence(text):
  doc = nlp(text.lower())
  return str(list(doc.sents)[-1])


def predict_file(file):
    df = pd.read_excel(file, engine="openpyxl")
    df['text'] = df['item_text'].parallel_apply(extract_sentence)
    df["predicted_level"] = bloom_make_predictions(df['text'], Probability=False)
    # Creating output and writer (pandas excel writer)
    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
        df.to_excel(excel_writer=writer, index=False,
                    sheet_name='Sheet1', header=True)
    return buffer
