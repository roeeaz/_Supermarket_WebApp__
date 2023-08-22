# paypal_config.py

import os
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment

class PayPalClient:
    def __init__(self):
        self.client_id = "AX7LBdl20cxcyFixye8AEnN6SIUociFEAZys8QcNMV7wkslJxnwlNkZrXx4Uy8Ecjrrjs9ItMSY3g5MK"
        self.client_secret = "EIMMP6QvawUSHJF8VamLEkSZtXxYFl5GHpY6Wsttkgosv15iNespNhFCx8sL5aB4LI3PAilo-Rrurvsh"
        
        """Set up and return PayPal Python SDK environment with PayPal access credentials.
           This sample uses SandboxEnvironment. In production, use LiveEnvironment."""
        self.environment = SandboxEnvironment(client_id=self.client_id, client_secret=self.client_secret)
        
        """ Returns PayPal HTTP client instance with environment which has access
            credentials context. This can be used invoke PayPal API's provided the
            credentials have the access to do so."""
        self.client = PayPalHttpClient(self.environment)

    def object(self):
        return self.client
