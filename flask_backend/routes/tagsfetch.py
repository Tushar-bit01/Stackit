from flask import Blueprint, render_template
from services.tags_serve import predict_tags

tags_bp = Blueprint("tags",__name__)

@tags_bp.route("/")
def home():
    return render_template("home.html")

@tags_bp.route('/get-tags', methods=["GET","POST"])
def get_tags():
    return predict_tags()

@tags_bp.route("/get-tags-form")
def get_tags_form():
    return render_template("get_tags_form.html")