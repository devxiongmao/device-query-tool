class Api::V1::SoftwaresController < ApplicationController
  before_action :find_device, only: [:index]

  def index
    @softwares = Software.where(device_id: @device.id)
    render json: @softwares, status: :ok
  end

  def show
    render json: Software.find(params[:id]), status: :ok
  end

  def create
    @software = Software.new(software_params)
    if @software.save
      render json: @software, status: :created
    else
      render json: @software.errors, status: :unprocessable_entity
    end
  end

  def update
    @software = Software.find(params[:id])

    if @software.update(software_params)
      render json: @software, status: :ok
    else
      render json: @software.errors, status: :unprocessable_entity
    end
  end

  private 
    def find_device
      @device = Device.find(params[:device_id])
    end

    # Strong typed params. Why you ask? Because we follow GOOD software engineering practices!
    def software_params
      params.require(:software).permit(
        :name,
        :platform,
        :ptcrb,
        :svn,
        :device_id
      )
    end
end
