from flask import request, jsonify, Blueprint
from utils import jacobi_symbol
from math import gcd

primary = Blueprint('primary', __name__)
@primary.route('/primary', methods=['GET'])
def get_primary():
    """
    Check whether 'n' is Fermat/Euler/Miller Rabin pseudo prime of 'n' with respect to 'a'
    """
    #Sanitize input
    n = request.args.get('n', type=int)
    a = request.args.get('a', type=int)
    test = request.args.get('test', type=str)
    if test is None:
        return jsonify({"error": "Please provide a 'test' parameter to indicate the primary test."}), 400
    if a is None or n is None:
        return jsonify({"error": "Please provide both 'n' and 'a' parameters."}), 400
    if n%2 == 0:
        return jsonify({"error": "Please provide an odd number for 'n'. Otherwise, it is not pseudoprime"}), 400
    
    
    # Check primary test
    if test == "fermat":
        # Fermat's Little Theorem
        # If n is prime, then a^(n-1) ≡ 1 (mod n)
        if pow(a, n-1, n) == 1:
            return jsonify({"result": False})
        else:
            return jsonify({"result": True})
    elif test == "euler":
        # Euler's Criterion
        # If n is prime, then a^((n-1)/2) ≡ (a/n) (mod n)
        if pow(a, (n-1)//2, n) == jacobi_symbol(a, n)%n:
            return jsonify({"result": False})
        else:
            return jsonify({"result": True})
    elif test == "miller_rabin":
        if gcd(a, n) != 1:
            return jsonify({"result": False})
        # Miller-Rabin test implementation
        d = n - 1
        r = 0
        while d % 2 == 0:
            d //= 2
            r += 1
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            return jsonify({"result": False})
        for _ in range(r-1):
            x = pow(x, 2, n)
            if x == n - 1:
                return jsonify({"result": False})            
        return jsonify({"result": True})
    else:
        return jsonify({"error": "Invalid test type. Use 'fermat', 'euler', or 'miller_rabin'."}), 400

