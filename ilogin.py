#!/usr/bin/env python
""" Single Sign-On (SSO) script
"""
from hashlib import sha256

LEVELS = {
    'paranoic': {
        48: u'@',
        49: u'!',
        50: u'2',
        51: u'e',
        52: u'H',
        53: u'S',
        54: u'6',
        55: u'z',
        56: u'8',
        57: u'G',
        97: u'A',
        98: u'W',
        99: u'#',
        100: u'%',
        101: u'e',
        102: u'$'
    }
}

class ILogin(object):
    """ Usage: ilogin.py <cmd>
    """
    def __init__(self, mode='normal'):
        self.mode = mode

    def __call__(self, service, password):
        string = "%s:%s" % (service, password)
        output = unicode(sha256(string).hexdigest()[-9:])

        if self.mode == 'normal':
            return output

        return output.translate(LEVELS.get(self.mode, {}))

