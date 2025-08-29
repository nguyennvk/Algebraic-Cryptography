from flask import request, jsonify, Blueprint

rsa_signature = Blueprint('rsa_signature', __name__)
@rsa_signature.route('/signature/rsa_signature', methods=['GET'])
def get_rsa_signature():
    """
    Verify whether Alice is authenticated by Bob using the RSA signature scheme.
    """
    # Sanitize input
    # Public key
    n = request.args.get('n', type=int)
    e = request.args.get('e', type=int)
    d = request.args.get('d', type=int)
    s = request.args.get('s', type=int)

    if n is None or e is None or d is None or s is None:
        return jsonify({"error": "Please provide 'n', 'e', 'd', and 's' parameters."}), 400
    
    if pow(s, e, n) != d % n:
        return jsonify({"authenticated": False}), 200
    else:
        return jsonify({"authenticated": True}), 200