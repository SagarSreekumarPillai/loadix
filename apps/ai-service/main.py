from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
from datetime import datetime, timedelta
import json

app = FastAPI(
    title="Lodix AI Service",
    description="AI-powered logistics optimization and forecasting service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Location(BaseModel):
    latitude: float
    longitude: float
    address: str
    city: str
    country: str

class RouteRequest(BaseModel):
    origin: Location
    destination: Location
    waypoints: Optional[List[Location]] = []
    vehicle_type: str = "truck"
    optimize_for: str = "time"  # time, cost, emissions

class RouteResponse(BaseModel):
    route_id: str
    origin: Location
    destination: Location
    waypoints: List[Location]
    total_distance: float
    total_time: float
    estimated_cost: float
    co2_footprint: float
    route_polyline: List[Dict[str, float]]
    created_at: datetime

class ForecastRequest(BaseModel):
    historical_data: List[Dict[str, Any]]
    forecast_horizon: int = 30  # days
    product_category: Optional[str] = None

class ForecastResponse(BaseModel):
    forecast_id: str
    predictions: List[Dict[str, Any]]
    confidence_intervals: List[Dict[str, float]]
    model_metrics: Dict[str, float]
    created_at: datetime

# Mock data and simple algorithms for MVP
def generate_mock_route(origin: Location, destination: Location) -> RouteResponse:
    """Generate a mock optimized route for MVP purposes"""
    # Simple distance calculation (Euclidean for MVP)
    lat_diff = destination.latitude - origin.latitude
    lon_diff = destination.longitude - origin.longitude
    distance = np.sqrt(lat_diff**2 + lon_diff**2) * 111  # Rough km conversion
    
    # Mock calculations
    total_time = distance * 0.5  # hours
    estimated_cost = distance * 2.5  # euros per km
    co2_footprint = distance * 0.15  # kg CO2 per km
    
    # Generate mock waypoints
    waypoints = []
    if distance > 100:  # Add waypoints for long routes
        num_waypoints = min(3, int(distance / 100))
        for i in range(1, num_waypoints + 1):
            ratio = i / (num_waypoints + 1)
            waypoint = Location(
                latitude=origin.latitude + lat_diff * ratio,
                longitude=origin.longitude + lon_diff * ratio,
                address=f"Waypoint {i}",
                city="Intermediate City",
                country="EU"
            )
            waypoints.append(waypoint)
    
    # Generate route polyline (simplified)
    route_polyline = [
        {"lat": origin.latitude, "lng": origin.longitude},
        *[{"lat": wp.latitude, "lng": wp.longitude} for wp in waypoints],
        {"lat": destination.latitude, "lng": destination.longitude}
    ]
    
    return RouteResponse(
        route_id=f"route_{np.random.randint(10000, 99999)}",
        origin=origin,
        destination=destination,
        waypoints=waypoints,
        total_distance=round(distance, 2),
        total_time=round(total_time, 2),
        estimated_cost=round(estimated_cost, 2),
        co2_footprint=round(co2_footprint, 2),
        route_polyline=route_polyline,
        created_at=datetime.utcnow()
    )

def generate_mock_forecast(historical_data: List[Dict[str, Any]], horizon: int) -> ForecastResponse:
    """Generate mock demand forecast for MVP purposes"""
    # Simple trend-based forecasting
    if len(historical_data) < 2:
        raise HTTPException(status_code=400, detail="Insufficient historical data")
    
    # Extract volumes and dates
    volumes = [item.get('volume', 100) for item in historical_data]
    base_volume = np.mean(volumes)
    
    # Generate predictions with some randomness
    predictions = []
    confidence_intervals = []
    
    for day in range(1, horizon + 1):
        # Simple trend + seasonality + noise
        trend = base_volume * (1 + 0.01 * day)  # 1% daily growth
        seasonality = base_volume * 0.1 * np.sin(2 * np.pi * day / 7)  # Weekly pattern
        noise = np.random.normal(0, base_volume * 0.05)  # 5% noise
        
        prediction = max(0, trend + seasonality + noise)
        confidence = base_volume * 0.15  # 15% confidence interval
        
        predictions.append({
            "date": (datetime.utcnow() + timedelta(days=day)).isoformat(),
            "predicted_volume": round(prediction, 2),
            "day_of_week": (datetime.utcnow() + timedelta(days=day)).weekday()
        })
        
        confidence_intervals.append({
            "lower": round(max(0, prediction - confidence), 2),
            "upper": round(prediction + confidence, 2)
        })
    
    return ForecastResponse(
        forecast_id=f"forecast_{np.random.randint(10000, 99999)}",
        predictions=predictions,
        confidence_intervals=confidence_intervals,
        model_metrics={
            "mae": round(np.random.uniform(5, 15), 2),
            "rmse": round(np.random.uniform(8, 20), 2),
            "r2": round(np.random.uniform(0.7, 0.95), 2)
        },
        created_at=datetime.utcnow()
    )

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "🚀 Lodix AI Service",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "route_optimization": "/api/optimize-route",
            "demand_forecasting": "/api/forecast-demand",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Lodix AI Service",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_models": {
            "route_optimization": "active",
            "demand_forecasting": "active",
            "anomaly_detection": "inactive"
        }
    }

@app.post("/api/optimize-route", response_model=RouteResponse)
async def optimize_route(request: RouteRequest):
    """Optimize route between origin and destination"""
    try:
        route = generate_mock_route(request.origin, request.destination)
        return route
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route optimization failed: {str(e)}")

@app.post("/api/forecast-demand", response_model=ForecastResponse)
async def forecast_demand(request: ForecastRequest):
    """Generate demand forecast based on historical data"""
    try:
        forecast = generate_mock_forecast(request.historical_data, request.forecast_horizon)
        return forecast
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demand forecasting failed: {str(e)}")

@app.get("/api/models/status")
async def get_model_status():
    """Get status of all AI models"""
    return {
        "models": {
            "route_optimization": {
                "status": "active",
                "version": "1.0.0",
                "last_updated": datetime.utcnow().isoformat(),
                "performance": {
                    "accuracy": "85%",
                    "response_time": "150ms"
                }
            },
            "demand_forecasting": {
                "status": "active",
                "version": "1.0.0",
                "last_updated": datetime.utcnow().isoformat(),
                "performance": {
                    "mae": "12.5",
                    "r2": "0.82"
                }
            },
            "anomaly_detection": {
                "status": "inactive",
                "version": "0.1.0",
                "last_updated": None,
                "performance": None
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
