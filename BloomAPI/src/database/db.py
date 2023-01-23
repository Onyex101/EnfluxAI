from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class QuestionTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, unique=True, nullable=False)
    prediction = db.Column(db.String(15), nullable=False)
    feedback = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())

    def __repr__(self) -> str:
        return 'Question>>> {self.question}'
