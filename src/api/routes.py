"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Invoice
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/token', methods=['POST'])
def generate_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Query the DB to check if user exists
    # email = email.lower()
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        response = {
            "msg": "User or Password does not match."
        }
        return jsonify(response), 401
    
    access_token = create_access_token(identity=user.id)
    response = {
        "access_token": access_token,
        "user_id": user.id,
        "msg": f"Welcome {user.email}!"
    }

    return jsonify(response), 200

#create a route for /signup that will add the user's email and password to the DB
#POST
#test that on postman
@api.route('/signup', methods=['POST'])
def register_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    
    #query to check if the email already exist
    email = email.lower()
    user = User.query.filter_by(email = email).first()

    if user is not None and user.email == email:
        response = {
            'msg': 'User already exists.'
        }
        return jsonify(response), 403
    # if the email does NOT exists, go ahead and make a new record in the DB
    # sign this person up
    user = User()
    user.email = email
    user.password = password
    user.is_active = True
    db.session.add(user)
    db.session.commit()
    

    response = {
        'msg': f'Congratulations {user.email}. You have successfuly signed up!'
    }
    return jsonify(response), 200


    



#create a route for /invoices that will retirieve and return the users invoices 
#ins json
@api.route('/invoice', methods=['GET'])
@jwt_required()
def get_invoice():
    # Retrieve the user_id of the current user from the access token
    user_id = get_jwt_identity()

    # Query and retrieve any invoices that are in the DB
    user_invoices = Invoice.query.filter_by(user_id=user_id).all()

    print('user_invoices: ', user_invoices)
    
    # Use a list comprehension to serialize each invoice
    processed_invoices = [each_invoice.serialize() for each_invoice in user_invoices]
    print("processed invoices:", processed_invoices)

    # Retrieve the user's email
    user = User.query.filter_by(id=user_id).first()

    response = {
        'msg': f"Hello {user.email}, here are your invoices.",
        'invoices': processed_invoices
    }

    return jsonify(response), 200
    

    #work on the front end
    # 1. create 3 new pages: /Signup, /Login, /Private
    #2. create the necessary inputs needed for signup.js and login.js
    #3. make sure that they are controlled inputs (useState)
    #4.include useContext and Context for flux applications
    #5.update flux.js to have token, message, invoices in the store!
    #6. update and test actions to be able to retrieve a token and save it in localStorage
