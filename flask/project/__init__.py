from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS, cross_origin
# from .user import User

db = SQLAlchemy()

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    # CORS(app, supports_credentials=True)
    CORS(app, resources=r'/*')

    app.config['SECRET_KEY'] = '5dbbcc98821c883275aeccf1'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    from .user import User

    # Blueprint for auth routes in app (unprotected)
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    # Blueprint for non-auth parts of app (but must be protected)
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    @login_manager.user_loader
    def load_user(user_id):
        # Since user_id is primary key of our table, use it in query for the user
        return User.query.get(int(user_id))

    return app