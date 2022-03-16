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
        
        req_body = request.get_json()
        username = req_body['username']
        password = req_body['password']

        # If user is already logged in, return
        if current_user.is_authenticated:
            response = flask.jsonify({"status": 200, "message": "Already Authenticated"})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        # If user is not logged in, check that username and password matches user in the database
        user = User.query.get(username)
        if (user):
            # Check if password correct
            if (user.password is password):
                user.authenticated = True
                db.session.add(user)
                db.session.commit()
                login_user(user, remember=True)
                response = flask.jsonify({"status": 200, "message": "successful"})
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response

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
    response = flask.jsonify({"status": 200, "message": "successful"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response