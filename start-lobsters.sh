# Exit if any errors occur
set -e

# Initialize the database
cd /lobsters
bin/rake db:create RAILS_ENV=development
bin/rake db:schema:load

echo "Lobsters::Application.config.secret_key_base = '`rake secret`'" >> \
    config/initializers/secret_token.rb

# Seed the database to create an initial administrator user and at least one tag.
bin/rake db:seed

# Run the rails server, and tell it to listen on 0.0.0.0 so that it will accept
# incoming connections from all IPs associated with tme machine and not just
# localhost.
rails server -b 0.0.0.0
