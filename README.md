# device-query-tool-BE
This tool allows users to query device RF capabilities. Curious to know if a phone supports a particular frequency band on a given software? Now you CAN! This tool is made with React as the front end and Rails as the backend. This particular repo is the rails, backend, repo.

# Installation

1. Make sure you have ruby installed `brew install ruby`
2. Make sure you have the bundler gem installed `gem install bundler`
3. Clone the repo, navigate into it, then run `bundle install`
4. Step back, and admire your handiwork (this is mandatory)

# Starting your Dev

## Running natively

1. Run `make install`
1. Run `make dev`


## Runner via Docker

Be sure you have [docker](https://www.docker.com/products/docker-desktop/) installed 

1. Run `make docker-build`
1. Run `make docker-dev`