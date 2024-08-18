class Api::V1::FeaturesController < ApplicationController

  def index
    render json: Feature.all, status: :ok
  end

  def create
    @feature = Feature.new(feature_params)
    if @feature.save
      render json: @feature, status: :created
    else
      render json: @feature.errors, status: :unprocessable_entity
    end
  end

  private 
    # Strong typed params. Why you ask? Because we follow GOOD software engineering practices!
    def feature_params
      params.require(:feature).permit(
        :name
      )
    end
end
