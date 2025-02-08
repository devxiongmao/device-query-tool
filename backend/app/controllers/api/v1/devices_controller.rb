class Api::V1::DevicesController < ApplicationController
  def index
    render json: Device.all, status: :ok
  end

  def show
    @device = Device.find(params[:id])
    render json: @device, status: :ok
  end

  def create
    @device = Device.new(device_params)
    if @device.save
      render json: @device, status: :created
    else
      render json: @device.errors, status: :unprocessable_entity
    end
  end

  def destroy
  end

  private 
    # Strong typed params. Why you ask? Because we follow GOOD software engineering practices!
    def device_params
      params.require(:device).permit(
        :vendor,
        :model_num,
        :market_name
      )
    end
end
