class Api::V1::SoftwaresController < ApplicationController
  before_action :find_device

  def index
    @softwares = Software.where(device_id: @device.id)
    render json: @softwares, status: :ok
  end

  private 
    def find_device
      @device = Device.find(params[:device_id])
    end
end
