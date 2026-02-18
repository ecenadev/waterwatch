// Function to add drawing tools to the map
function addDrawingTools() {
    // Create a control container for drawing tools
    var drawControl = L.control({ position: 'topleft' });
    
    drawControl.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'drawing-controls');
        div.innerHTML = `
            <div style="background: rgba(0,0,0,0.85); padding: 10px; border-radius: 5px; color: white;">
                <h5 style="margin: 0 0 10px 0; text-align: center;">Drawing Tools</h5>
                <button id="drawPolygon" style="margin: 2px; padding: 5px; background: #005a32; color: white; border: none; border-radius: 3px; cursor: pointer; width: 100%;">Draw Polygon</button>
                <button id="drawLine" style="margin: 2px; padding: 5px; background: #005a32; color: white; border: none; border-radius: 3px; cursor: pointer; width: 100%;">Draw Line</button>
                <button id="drawPoint" style="margin: 2px; padding: 5px; background: #005a32; color: white; border: none; border-radius: 3px; cursor: pointer; width: 100%;">Draw Point</button>
                <button id="clearDrawings" style="margin: 2px; padding: 5px; background: #8B0000; color: white; border: none; border-radius: 3px; cursor: pointer; width: 100%;">Clear All</button>
            </div>
        `;
        return div;
    };
    
    drawControl.addTo(map);

    // Variables to track drawing state
    var currentDrawing = null;
    var isDrawing = false;
    var drawnItems = [];

    // Add event listeners
    setTimeout(function() {
        document.getElementById('drawPolygon').addEventListener('click', function(e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            startDrawingPolygon();
        });
        document.getElementById('drawLine').addEventListener('click', function(e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            startDrawingLine();
        });
        document.getElementById('drawPoint').addEventListener('click', function(e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            startDrawingPoint();
        });
        document.getElementById('clearDrawings').addEventListener('click', function(e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            clearAllDrawings();
        });
    }, 100);

    function startDrawingPolygon() {
        if (isDrawing) {
            stopDrawing();
            return;
        }
        
        isDrawing = true;
        map.getContainer().style.cursor = 'crosshair';
        document.getElementById('drawPolygon').style.background = '#ff0000';
        document.getElementById('drawPolygon').textContent = 'Finish Polygon';
        
        var points = [];
        var polyline = null;
        var polygon = null;

        function onMapClick(e) {
            points.push(e.latlng);
            
            // Update temporary polyline
            if (polyline) {
                map.removeLayer(polyline);
            }
            if (points.length > 1) {
                polyline = L.polyline(points, {color: 'red', dashArray: '5, 5'}).addTo(map);
            }
            
            // Show temporary polygon if we have at least 3 points
            if (points.length >= 3) {
                if (polygon) {
                    map.removeLayer(polygon);
                }
                polygon = L.polygon(points, {color: 'red', fillColor: 'red', fillOpacity: 0.3, dashArray: '5, 5'}).addTo(map);
            }
            
            // Check if clicking near first point to complete polygon
            if (points.length > 2) {
                var firstPoint = points[0];
                var distance = map.distance(firstPoint, e.latlng);
                if (distance < 50) { // 50 meters tolerance
                    completePolygon(points);
                }
            }
        }

        function completePolygon(finalPoints) {
            var finalPolygon = L.polygon(finalPoints, {
                color: 'blue',
                weight: 3,
                fillColor: 'blue',
                fillOpacity: 0.4
            }).addTo(map);
            
            finalPolygon.bindPopup(`
                <div style="color: black;">
                    <h4>Custom Polygon</h4>
                    <p><b>Points:</b> ${finalPoints.length}</p>
                    <button onclick="removeThisLayer(this)" style="padding: 5px; background: red; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                </div>
            `);
            
            drawnItems.push(finalPolygon);
            cleanupDrawing();
        }

        map.on('click', onMapClick);

        // Double click to finish
        map.on('dblclick', function(e) {
            if (points.length >= 3) {
                completePolygon(points);
            } else {
                alert('Need at least 3 points to create a polygon!');
            }
        });

        currentDrawing = {
            type: 'polygon',
            points: points,
            cleanup: function() {
                map.off('click', onMapClick);
                map.off('dblclick');
                if (polyline) map.removeLayer(polyline);
                if (polygon) map.removeLayer(polygon);
            }
        };
    }

    function startDrawingLine() {
        if (isDrawing) {
            stopDrawing();
            return;
        }
        
        isDrawing = true;
        map.getContainer().style.cursor = 'crosshair';
        document.getElementById('drawLine').style.background = '#ff0000';
        document.getElementById('drawLine').textContent = 'Finish Line';
        
        var points = [];
        var polyline = null;

        function onMapClick(e) {
            points.push(e.latlng);
            
            // Update temporary polyline
            if (polyline) {
                map.removeLayer(polyline);
            }
            if (points.length > 1) {
                polyline = L.polyline(points, {color: 'green', weight: 4, dashArray: '5, 5'}).addTo(map);
            }
        }

        function completeLine(finalPoints) {
            var finalLine = L.polyline(finalPoints, {
                color: 'green',
                weight: 4
            }).addTo(map);
            
            finalLine.bindPopup(`
                <div style="color: black;">
                    <h4>Custom Line</h4>
                    <p><b>Points:</b> ${finalPoints.length}</p>
                    <button onclick="removeThisLayer(this)" style="padding: 5px; background: red; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                </div>
            `);
            
            drawnItems.push(finalLine);
            cleanupDrawing();
        }

        map.on('click', onMapClick);

        // Double click to finish
        map.on('dblclick', function(e) {
            if (points.length >= 2) {
                completeLine(points);
            } else {
                alert('Need at least 2 points to create a line!');
            }
        });

        currentDrawing = {
            type: 'line',
            points: points,
            cleanup: function() {
                map.off('click', onMapClick);
                map.off('dblclick');
                if (polyline) map.removeLayer(polyline);
            }
        };
    }

    function startDrawingPoint() {
        if (isDrawing) {
            stopDrawing();
            return;
        }
        
        isDrawing = true;
        map.getContainer().style.cursor = 'crosshair';
        document.getElementById('drawPoint').style.background = '#ff0000';
        document.getElementById('drawPoint').textContent = 'Stop Drawing Points';
        
        function onMapClick(e) {
            var point = L.marker(e.latlng, {
                icon: L.divIcon({
                    className: 'custom-point',
                    html: '<div style="background: purple; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                    iconSize: [16, 16]
                })
            }).addTo(map);
            
            point.bindPopup(`
                <div style="color: black;">
                    // <h4>Custom Point</h4>
                    <p><b>Lat:</b> ${e.latlng.lat.toFixed(4)}</p>
                    <p><b>Lng:</b> ${e.latlng.lng.toFixed(4)}</p>
                    <button onclick="removeThisLayer(this)" style="padding: 5px; background: red; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                </div>
            `);
            
            drawnItems.push(point);
        }

        map.on('click', onMapClick);

        currentDrawing = {
            type: 'point',
            cleanup: function() {
                map.off('click', onMapClick);
            }
        };
    }

    function stopDrawing() {
        if (currentDrawing) {
            currentDrawing.cleanup();
            currentDrawing = null;
        }
        cleanupDrawing();
    }

    function cleanupDrawing() {
        isDrawing = false;
        map.getContainer().style.cursor = '';
        
        // Reset button styles
        document.getElementById('drawPolygon').style.background = '#005a32';
        document.getElementById('drawPolygon').textContent = 'Draw Polygon';
        document.getElementById('drawLine').style.background = '#005a32';
        document.getElementById('drawLine').textContent = 'Draw Line';
        document.getElementById('drawPoint').style.background = '#005a32';
        document.getElementById('drawPoint').textContent = 'Draw Point';
    }

    function clearAllDrawings() {
        drawnItems.forEach(function(layer) {
            map.removeLayer(layer);
        });
        drawnItems = [];
    }

    // Global function for popup delete buttons
    window.removeThisLayer = function(button) {
        var popup = button.closest('.leaflet-popup');
        if (popup) {
            var layer = L.DomUtil.get(popup)._source;
            map.removeLayer(layer);
            
            // Remove from drawnItems array
            var index = drawnItems.indexOf(layer);
            if (index > -1) {
                drawnItems.splice(index, 1);
            }
        }
    };
}

// Call this function to activate drawing tools
addDrawingTools();


//////////////////////

// on to enable polygon editing and send updates to backend-----------------------------------------====================================================
// Polygon Editing Functions
window.enablePolygonEditing = function(polygon, polygonId) {
    // Get current coordinates
    var currentCoords = polygon.getLatLngs()[0];
    
    // Create arrays to store markers and coordinates
    var markers = [];
    var updatedCoords = [];
    
    // Add vertex markers for each point
    currentCoords.forEach(function(coord, index) {
        var marker = L.marker([coord.lat, coord.lng], {
            draggable: true,
            icon: L.divIcon({
                className: 'vertex-marker',
                html: '<div style="background: #ff0000; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
                iconSize: [16, 16]
            })
        }).addTo(map);
        
        marker.index = index;
        markers.push(marker);
        updatedCoords[index] = [coord.lat, coord.lng];
        
        // Update coordinates when marker is dragged
        marker.on('drag', function(e) {
            var newPos = e.target.getLatLng();
            updatedCoords[this.index] = [newPos.lat, newPos.lng];
            updatePolygonShape();
        });
        
        // Right-click to delete vertex
        marker.on('contextmenu', function(e) {
            L.DomEvent.preventDefault(e);
            if (markers.length > 3) {
                map.removeLayer(this);
                markers.splice(this.index, 1);
                updatedCoords.splice(this.index, 1);
                reindexMarkers();
                updatePolygonShape();
            } else {
                alert('Polygon needs at least 3 points!');
            }
        });
    });
    
    function updatePolygonShape() {
        var latLngs = updatedCoords.map(function(coord) {
            return L.latLng(coord[0], coord[1]);
        });
        polygon.setLatLngs([latLngs]);
    }
    
    function reindexMarkers() {
        markers.forEach(function(marker, index) {
            marker.index = index;
        });
    }
    
    // Store editing state
    if (!window.editablePolygons) {
        window.editablePolygons = {};
    }
    window.editablePolygons[polygonId] = {
        polygon: polygon,
        markers: markers,
        updatedCoords: updatedCoords
    };
    
    // Change polygon style to indicate editing mode
    polygon.setStyle({
        color: '#ff0000',
        fillColor: '#ff0000',
        fillOpacity: 0.3,
        weight: 3
    });
    
    // Update popup for editing mode
    polygon.bindPopup(`
        <div style="color: black; min-width: 250px;">
            <h4>✏️ Editing Mode</h4>
            <p><strong>Instructions:</strong></p>
            <ul style="text-align: left; font-size: 12px; margin: 10px 0;">
                <li>Drag red points to reshape</li>
                <li>Right-click points to delete</li>
                <li>Click "Add Point" to insert new vertices</li>
            </ul>
            <button onclick="savePolygonEdits('${polygonId}')" 
                    style="padding: 8px 12px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; margin: 2px; width: 100%;">
                💾 Save Changes
            </button>
            <button onclick="addVertexToPolygon('${polygonId}')" 
                    style="padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; margin: 2px; width: 100%;">
                ➕ Add Point
            </button>
            <button onclick="disablePolygonEditing('${polygonId}')" 
                    style="padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; margin: 2px; width: 100%;">
                ❌ Cancel
            </button>
        </div>
    `).openPopup();
};

// Function to add a new vertex
window.addVertexToPolygon = function(polygonId) {
    if (!window.editablePolygons || !window.editablePolygons[polygonId]) return;
    
    var editable = window.editablePolygons[polygonId];
    var markers = editable.markers;
    var updatedCoords = editable.updatedCoords;
    
    if (markers.length < 2) return;
    
    // Find the longest edge to add point in the middle
    var maxDistance = 0;
    var insertIndex = 0;
    
    for (var i = 0; i < markers.length; i++) {
        var nextIndex = (i + 1) % markers.length;
        var point1 = updatedCoords[i];
        var point2 = updatedCoords[nextIndex];
        
        var distance = Math.sqrt(
            Math.pow(point2[0] - point1[0], 2) + 
            Math.pow(point2[1] - point1[1], 2)
        );
        
        if (distance > maxDistance) {
            maxDistance = distance;
            insertIndex = nextIndex;
        }
    }
    
    // Calculate midpoint
    var prevIndex = (insertIndex === 0) ? markers.length - 1 : insertIndex - 1;
    var point1 = updatedCoords[prevIndex];
    var point2 = updatedCoords[insertIndex];
    
    var newLat = (point1[0] + point2[0]) / 2;
    var newLng = (point1[1] + point2[1]) / 2;
    
    // Insert new point
    updatedCoords.splice(insertIndex, 0, [newLat, newLng]);
    
    // Create new marker
    var marker = L.marker([newLat, newLng], {
        draggable: true,
        icon: L.divIcon({
            className: 'vertex-marker',
            html: '<div style="background: #ff0000; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
            iconSize: [16, 16]
        })
    }).addTo(map);
    
    marker.index = insertIndex;
    markers.splice(insertIndex, 0, marker);
    
    // Reindex all markers
    markers.forEach(function(marker, index) {
        marker.index = index;
    });
    
    // Add event handlers to new marker
    marker.on('drag', function(e) {
        var newPos = e.target.getLatLng();
        updatedCoords[this.index] = [newPos.lat, newPos.lng];
        updatePolygonShape();
    });
    
    marker.on('contextmenu', function(e) {
        L.DomEvent.preventDefault(e);
        if (markers.length > 3) {
            map.removeLayer(this);
            markers.splice(this.index, 1);
            updatedCoords.splice(this.index, 1);
            reindexMarkers();
            updatePolygonShape();
        }
    });
    
    function updatePolygonShape() {
        var latLngs = updatedCoords.map(function(coord) {
            return L.latLng(coord[0], coord[1]);
        });
        editable.polygon.setLatLngs([latLngs]);
    }
    
    function reindexMarkers() {
        markers.forEach(function(marker, index) {
            marker.index = index;
        });
    }
    
    updatePolygonShape();
};

// Function to save edits to backend
window.savePolygonEdits = function(polygonId) {
    if (!window.editablePolygons || !window.editablePolygons[polygonId]) {
        alert('No polygon found for editing!');
        return;
    }
    
    var editable = window.editablePolygons[polygonId];
    var updatedCoords = editable.updatedCoords;
    
    // Prepare data for backend
    var updateData = {
        id: polygonId,
        coordinates: JSON.stringify(updatedCoords),
        type: 'polygon'
    };
    
    console.log('Saving polygon edits:', updateData);
    
    // Send to backend (replace with your actual endpoint)
    $.ajax({
        url: '/waterconsumption/updatepolygon',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updateData),
        success: function(response) {
            alert('✅ Polygon updated successfully!');
            disablePolygonEditing(polygonId);
        },
        error: function(xhr, status, error) {
            console.error('Error updating polygon:', error);
            alert('❌ Error updating polygon: ' + error);
        }
    });
};

// Function to disable editing
window.disablePolygonEditing = function(polygonId) {
    if (!window.editablePolygons || !window.editablePolygons[polygonId]) return;
    
    var editable = window.editablePolygons[polygonId];
    
    // Remove all vertex markers
    editable.markers.forEach(function(marker) {
        map.removeLayer(marker);
    });
    
    // Restore original polygon style
    editable.polygon.setStyle({
        color: 'white',
        fillColor: getColor(editable.polygon.averageMonthlyKL || 20),
        fillOpacity: 0.8,
        weight: 2
    });
    
    // Restore original popup or create basic one
    editable.polygon.bindPopup(`
        <div style="color: black; min-width: 200px;">
            <h4>Polygon</h4>
            <button onclick="enablePolygonEditing(this._source, '${polygonId}')" 
                    style="padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; margin: 5px; width: 100%;">
                ✏️ Edit Shape
            </button>
            <button onclick="deleteLayer('${polygonId}', 'Polygon')" 
                    style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; margin: 5px; width: 100%;">
                🗑️ Delete
            </button>
        </div>
    `);
    
    // Clean up
    delete window.editablePolygons[polygonId];
};

// Function to add edit buttons to all polygons
function addEditButtonsToPolygons() {
    // Add to server-loaded polygons
    allPolygons.forEach(function(polyObj) {
        var polygon = polyObj.layer;
        var polygonId = polyObj.data.id || 'server_polygon_' + polygon._leaflet_id;
        
        // Store data for reference
        polygon.averageMonthlyKL = polyObj.data.averageMonthlyKL;
        
        polygon.bindPopup(`
            <div style="color: black; min-width: 200px;">
                <h4>${polyObj.data.neighbourhood || 'Area'}</h4>
                <p>Consumption: ${polyObj.data.averageMonthlyKL} KL</p>
                <button onclick="enablePolygonEditing(this._source, '${polygonId}')" 
                        style="padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; margin: 5px; width: 100%;">
                    ✏️ Edit Shape
                </button>
            </div>
        `);
    });
    
    console.log('Edit buttons added to polygons');
}

// Initialize editing when page loads
setTimeout(function() {
    addEditButtonsToPolygons();
}, 2000);