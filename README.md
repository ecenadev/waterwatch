# WaterWatch – GIS Web Application

## Overview

WaterWatch is a GIS-based web application built with C# and ASP.NET.
The system is designed to visualize and manage geospatial data related to water resources through an interactive web interface.

The application allows users to display, analyze, and interact with geographic data layers in a browser environment.

## Features

* Interactive map visualization
* GIS layer rendering
* Spatial data display and management
* Web-based interface
* Backend developed in C# (.NET)
* Structured and scalable architecture

## Technologies Used

* **C#**
* **ASP.NET / ASP.NET Core**
* **Postgres SQL Server**
* **JavaScript mapping libraries (e.g., Leaflet / OpenLayers / etc.)**
* HTML / CSS / JavaScript

## Project Structure (Example)

```
waterwatch/
│
├── Controllers/        # MVC / API controllers
├── Models/             # Data models
├── Views/              # Razor views (if MVC)
├── wwwroot/            # Static files (JS, CSS, images)
├── Data/               # Database context and configurations
└── WaterWatch.sln
```

## Prerequisites

Before running the project, make sure you have:

* .NET SDK (matching the project version)
* Visual Studio or Visual Studio Code
* SQL Server (if database is used)

You can check your .NET version with:

```
dotnet --version
```

## Setup & Installation

1. Clone the repository:

```
git clone https://github.com/ecenadev/waterwatch.git
cd waterwatch
```

2. Restore dependencies:

```
dotnet restore
```

3. Update the database connection string in:

```
appsettings.json
```

4. Apply migrations (if using Entity Framework):

```
dotnet ef database update
```

5. Run the application:

```
dotnet run
```

6. Open in browser:

```
https://localhost:5001
```

*(Port may vary depending on configuration.)*

## How It Works

* The backend serves geospatial and attribute data.
* The frontend renders map layers dynamically.
* Users can interact with spatial objects, view metadata, and analyze geographic information directly in the browser.

## Use Cases

* Water infrastructure monitoring
* Environmental data visualization
* GIS-based planning tools
* Academic GIS projects

## License

This project is intended for academic and demonstration purposes.
Please refer to the repository license file for details.
