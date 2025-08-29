from flask import request, jsonify, Blueprint

gcd = Blueprint('gcd', __name__)

@gcd.route('/gcd', methods=['GET'])
def get_gcd():
    """
    Calculate the GCD of two numbers using the Euclidean algorithm.
    The function takes two integers 'a' and 'b' as query parameters and returns the GCD along with the steps taken to compute it.
    The steps include the dividend, divisor, quotient, and remainder at each step of the algorithm.
    The function also handles cases where the input values are negative or zero.
    If either 'a' or 'b' is not provided, it returns an error message.
    """
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)
    if a is None or b is None:
        return jsonify({"error": "Please provide both 'a' and 'b' as query parameters."}), 400
    
    process_list = []
    def euclid(a, b):
        while b:
            process_list.append({"dividend": a, "divisor": b, "quotient": a//b, "remainder": a%b})
            a, b = b, a % b
        return {"gcd": abs(a), "steps": process_list}
    
    a, b = abs(a), abs(b)
    result = euclid(a, b) if a > b else euclid(b, a)
    return jsonify(result), 200

