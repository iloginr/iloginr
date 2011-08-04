""" Main application
"""
import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class MainPage(webapp.RequestHandler):
    def get(self):
        options = {}
        path = os.path.dirname(__file__)
        path = os.path.split(path)[0]
        path = os.path.join(path, 'templates', 'index.html')
        self.response.out.write(template.render(path, options))

    def post(self):
        return self.get()

application = webapp.WSGIApplication(
    [('/', MainPage)],
    debug=True
)

def main():
    from google.appengine.ext.webapp.util import run_wsgi_app
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
