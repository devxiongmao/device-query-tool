FROM ruby:3.0.0

WORKDIR /usr/src/app

COPY Gemfile ./

RUN gem install bundler 
RUN bundle config set force_ruby_platform true
RUN bundle install


COPY . .

EXPOSE 3001

CMD rm -f ./tmp/pids/server.pid && rails s -p 3001 -b 0.0.0.0