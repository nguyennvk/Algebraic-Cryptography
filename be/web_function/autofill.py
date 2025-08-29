from web_function.suggestion import suggestion
from flask import Flask, request, jsonify, Blueprint

autofill_bp = Blueprint('autofill', __name__)
@autofill_bp.route('/autofill', methods=['GET'])
def autofill():
    word = request.args.get('word', '')
    if not word:
        return jsonify({}), 200
    # Call the suggestion function to get the matching keys
    result = suggestion(word)
    
    # Return the result as JSON
    return jsonify(result)