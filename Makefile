
.PHONY: install
install:
	gem install bundler
	bundle install

.PHONY: dev
dev:
	rails server -p 3001
