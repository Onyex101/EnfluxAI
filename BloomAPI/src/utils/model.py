import numpy as np
import pandas as pd
import keras
from tensorflow.keras.utils import pad_sequences
from lime.lime_text import LimeTextExplainer
import pickle
import io

with open('src/ml_models/model_tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

model = keras.models.load_model("src/ml_models/lstm_model")
max_length = 70
padding_type = "pre"
trunction_type="pre"
labels = ['analysis', 'application', 'comprehension', 'evaluation', 'knowledge', 'synthesis']

def make_predictions(X_batch_text, Probability=True):
  seq = tokenizer.texts_to_sequences(X_batch_text)
  padded = pad_sequences(seq, maxlen=max_length, padding=padding_type, truncating=trunction_type)
  y_preds = model.predict(padded)
  return y_preds if Probability else [labels[np.argmax(i)] for i in y_preds]


def get_prediction(question):
    pred = make_predictions([question])[0].round(3)
    res = labels[np.argmax(pred)]
    return {"class":res, "proba":str(np.max(pred))}


def load_LIME(question):
    explainer = LimeTextExplainer(class_names=labels, verbose=True)
    explanation = explainer.explain_instance(
        question, classifier_fn=make_predictions, num_features=6, top_labels=1, num_samples=1000)
    return explanation.as_html()


def predict_file(file):
    df = pd.read_excel(file, engine="openpyxl")
    df["predicted_level"] = make_predictions(df['item_text'], Probability=False)
    # Creating output and writer (pandas excel writer)
    out = io.BytesIO()
    writer = pd.ExcelWriter(out, engine='openpyxl')
    df.to_excel(excel_writer=writer, index=False, sheet_name='Sheet1', header=True)
    # writer.save()
    # out.seek(0)
    writer.close()
    return out.getvalue()
