from audioop import cross
from tkinter import Y
from flask import Blueprint, request
from .detection import Detection
from flask_cors import CORS, cross_origin

main = Blueprint('main', __name__)
CORS(main)

@main.route('/')
def helloWorld():
  return 'Hello World!'

@main.route('/yoloDetection')
@cross_origin()
def yoloDetection():
  d = dict()
  d['data'] = []
  d['data'].append(Detection(x=3.752322, Y=-7.722432, distance=7.760108))
  d['data'].append(Detection(x=7.291943, y=-10.397675, distance=5.463225))
  d['data'].append(Detection(x=13.696383, y=1.454617, distance=4.825251))
  return d
