from asyncio import constants
from flask import Blueprint, request, Flask, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from .user import User
from . import db
from flask_cors import CORS
import json
import requests

auth = Blueprint('auth', __name__)
CORS(auth)

@auth.route('/*', methods=['POST'])
def login():
    if request.method == 'POST':
        # (1)
        req_body = request.get_json()
        username = req_body['username']
        password = req_body['password'] # will be encrypted

        # If user is already logged in, return
        if current_user.is_authenticated:
            # return json.dumps({"status": 200, "message": "Already authenticated"})
            response = flask.jsonify({"status": 200, "message": "Already Authenticated"})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        # If user is not logged in, check that username and password matches user in the database
        # user = User.query.filter_by(username=username).first()
        user = User.query.get(username)
        if (user):
            # Check password
            # if bcrypt.check_password_hash(user.password, password):
            if (user.password is password):
                user.authenticated = True
                db.session.add(user)
                db.session.commit()
                login_user(user, remember=True)
                # return json.dumps({"status": 200, "message": "Successfully authenticated"})
                response = flask.jsonify({"status": 200, "message": "successful"})
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response

        # return json.dumps({"status": 500, "message": "Failed to authenticated"})
        response = flask.jsonify({"status": 500, "message": " Failed to authenticated"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

@auth.route('/logout')
@login_required
def logout():
    user = current_user
    user.authenticated = False
    db.session.add(user)
    db.session.commit()
    logout_user()
    # return json.dumps({'status': 200})
    response = flask.jsonify({"status": 200, "message": "successful"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response