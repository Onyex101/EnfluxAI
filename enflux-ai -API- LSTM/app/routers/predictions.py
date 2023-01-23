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
    predict: Optional[str]
    feedback: Optional[str]

class Feedback(BaseModel):
    feedback: str


@router.on_event("startup")
def load_models():
    with open("app/ml_model/model_tokenizer.pkl", 'rb') as f:
        global tokenizer
        tokenizer = pickle.load(f)
    global model
    model = keras.models.load_model("app/ml_model/lstm_model")
    global max_length
    max_length = 70
    global padding_type
    padding_type = "pre"
    global trunction_type
    trunction_type="pre"
    global labels
    labels = ['analysis', 'application', 'comprehension', 'evaluation', 'knowledge', 'synthesis']
    print("_____models loaded successfully_____")


@router.post('/')
async def predict_text_no_auth(prediction: Prediction, db: Session = Depends(get_db)):
    text = get_prediction(prediction.text.strip())
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
    text = get_prediction(prediction.text.strip())
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
    lime = load_LIME(prediction.text.strip())
    return succesful_response(200, lime)


@router.post('/lime/user')
async def get_lime_auth(prediction: Prediction, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user is None:
        raise get_user_exceptions()
    lime = load_LIME(prediction.text.strip())
    return succesful_response(200, lime)


@router.post('/file')
async def predict_batch_no_auth(file: UploadFile = File(...)):
    if file and allowed_file(file.filename):
        batch_file = BytesIO(file.file.read())
        buffer: BytesIO = predict_file(batch_file)
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


def make_predictions(X_batch_text, Probability=True):
  seq = tokenizer.texts_to_sequences(X_batch_text)
  padded = pad_sequences(seq, maxlen=max_length, padding=padding_type, truncating=trunction_type)
  y_preds = model.predict(padded)
  return y_preds if Probability else [labels[np.argmax(i)] for i in y_preds]


def get_prediction(text):
    pred = make_predictions([extract_sentence(text)])[0].round(3)
    res = labels[np.argmax(pred)]
    return {"class":res, "proba":str(np.max(pred))}


def load_LIME(text):
    text = extract_sentence(text)
    explainer = LimeTextExplainer(class_names=labels, verbose=True)
    explanation = explainer.explain_instance(
        text, classifier_fn=make_predictions, num_features=6, top_labels=1, num_samples=100)
    return explanation.as_html()


def extract_sentence(text):
  doc = nlp(text.lower())
  return str(list(doc.sents)[-1])


def predict_file(file):
    df = pd.read_excel(file, engine="openpyxl")
    df['text'] = df['item_text'].parallel_apply(extract_sentence)
    df["predicted_level"] = make_predictions(df['text'], Probability=False)
    # Creating output and writer (pandas excel writer)
    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
        df.to_excel(excel_writer=writer, index=False,
                    sheet_name='Sheet1', header=True)
    return buffer
