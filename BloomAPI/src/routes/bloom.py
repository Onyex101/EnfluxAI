from flask import Blueprint, request, jsonify, make_response
from src.constants.http_status_codes import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_406_NOT_ACCEPTABLE
from flasgger import swag_from
from sqlalchemy.exc import SQLAlchemyError
from src.utils.model import get_prediction, predict_file, load_LIME
from src.database.db import db, QuestionTable
from flask_cors import cross_origin
from src.utils.misc import allowed_file

bloom = Blueprint("bloom", __name__, url_prefix="/api/v1/bloom")

@bloom.post("/")
@swag_from('../docs/bloom/pred_question.yaml')
@cross_origin(origin='*', supports_credentials=True)
def getInfo():
    question = request.json.get('question', '')
    if len(question.split()) < 4:
        return jsonify({"error": "minimum word length of 4 required"}), HTTP_400_BAD_REQUEST
    pred = get_prediction(question)
    # print(f"prediction: {pred}")
    data = {
        "question": question,
        "prediction": pred['class'],
        "proba": pred['proba']
    }
    try:
        q = QuestionTable(question=question,
                          prediction=pred['class'])
        db.session.add(q)
        db.session.commit()
        data["id"] = q.id
        return jsonify(data), HTTP_200_OK
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({error: "database error"}), HTTP_400_BAD_REQUEST


@bloom.post("/<int:question_id>")
@cross_origin(origin='*', supports_credentials=True)
def addFeedback(question_id):
    feedback = request.json.get('feedback', '')
    try:
        q = QuestionTable.query.filter_by(id=question_id).first()
        q.feedback = feedback
        db.session.add(q)
        db.session.commit()
        return jsonify({"message": "success"}), HTTP_200_OK
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({error: e}), HTTP_400_BAD_REQUEST


@bloom.post("/lime")
@cross_origin(origin='*', supports_credentials=True)
def generateLIME():
    question = request.json.get('question', '')
    if len(question.split()) < 4:
        return jsonify({"error": "minimum word length of 4 required"}), HTTP_400_BAD_REQUEST
    data = {
        "lime_explainer": load_LIME(question),
    }
    return jsonify(data), HTTP_200_OK


@bloom.post("/file")
@cross_origin(origin='*', supports_credentials=True)
def upload_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"error": "no selected file for uploading"}), HTTP_400_BAD_REQUEST
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = file.filename
        newFile_name = f"{filename.rsplit('.', 1)[0].lower()}_pred.{filename.rsplit('.', 1)[1].lower()}"
        # Flask create response 
        r = make_response(predict_file(file))
        # Defining correct excel headers
        r.headers["Content-Disposition"] = f"attachment; filename={newFile_name}"
        r.headers["Content-filename"] = f"{newFile_name}"
        r.headers["Content-type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        return  r, HTTP_200_OK
    else:
        return jsonify({"error": "Allowed file types are xlsx, xlsm"}), HTTP_406_NOT_ACCEPTABLE
