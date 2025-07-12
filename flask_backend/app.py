from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True) 

from routes.tagsfetch import tags_bp
app.register_blueprint(tags_bp)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
