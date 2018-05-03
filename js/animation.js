var USER_SPEED = "medium";
var REAL_TIME = true;
var FILTER = "all";
var PAUSE = true;

var speeds = {"slow": 1000, "medium": 200, "fast": 50};

var sched_objs = all;

var curr_minute = 0;
// 8 10 11
var act_codes = [
    {"index": "0", "short": "Sleeping", "desc": "Sleeping", "color": "#ff6384"},
    {"index": "1", "short": "Personal Care", "desc": "Personal Care", "color": "#ff9f40"},
    {"index": "2", "short": "Housework", "desc": "Housework", "color": "#C7F464"},
    {"index": "3", "short": "Education", "desc": "Education", "color": "#36a2eb"},
    {"index": "4", "short": "Shopping", "desc": "Shopping", "color": "#C44D58"},
    {"index": "5", "short": "Eating & Drinking", "desc": "Eating & Drinking", "color": "#00b400"},
    {"index": "6", "short": "Leisure", "desc": "Socializing, Relaxing, & Leisure", "color": "#ffcd56"},
    {"index": "7", "short": "Care for Others", "desc": "Volunteer", "color": "#9966ff"},
    {"index": "8", "short": "Sports", "desc": "Sports", "color": "#FECEA8"},
    {"index": "9", "short": "Work", "desc": "Work", "color": "#4bc0c0"},
    {"index": "10", "short": "Religion", "desc": "Religious & Spiritual Activities", "color": "#99B898"},
    {"index": "11", "short": "Other", "desc": "Other", "color": "#2A363B"},
    {"index": "12", "short": "Traveling", "desc": "Traveling", "color": "#e6e6e6"}
];

var act_counts = {
    "name": "act_counts",
    "children": [
        {"name": "0", "index": 0, "size": 0},
        {"name": "1", "index": 1, "size": 0},
        {"name": "2", "index": 2, "size": 0},
        {"name": "3", "index": 3, "size": 0},
        {"name": "4", "index": 4, "size": 0},
        {"name": "5", "index": 5, "size": 0},
        {"name": "6", "index": 6, "size": 0},
        {"name": "7", "index": 7, "size": 0},
        {"name": "8", "index": 8, "size": 0},
        {"name": "9", "index": 9, "size": 0},
        {"name": "10", "index": 10, "size": 0},
        {"name": "11", "index": 11, "size": 0},
        {"name": "12", "index": 12, "size": 0}
    ]
};

var width = 780,
    height = 800,
    padding = 1,
    maxRadius = 3;

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

// Foci
var foci = {};

var act_index = [];

var center_act = "Traveling",
    center_pt = {"x": 380, "y": 365};

act_codes.forEach(function (code, i) {
    act_index.push(code.short);
    if (code.desc === center_act) {
        foci[code.index] = {x: center_pt.x, y: center_pt.y, color: code.color};
    } else {
        var theta = 2 * Math.PI / (act_codes.length - 1);
        foci[code.index] = {x: 250 * Math.cos(i * theta) + 380, y: 250 * Math.sin(i * theta) + 365, color: code.color};
    }
});

// Create node objects
var nodes = sched_objs.map(function (o, i) {
    var act = o[0].act;
    act_counts.children[+act].size += 1;
    var init_x = foci[act].x + Math.random();
    var init_y = foci[act].y + Math.random();
    return {
        act: act,
        radius: 3,
        x: init_x,
        y: init_y,
        fill: foci[act].color, //color(act),
        moves: 0,
        next_move_time: o[0].duration,
        sched: o
    }
});

// Force-directed layout
var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .friction(.91)
    .on("tick", tick)
    .start();

// Draw circle for each node.
var circle = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("id", function (d) {
        return d.id;
    })
    .attr("class", "node")
    .style("fill", function (d) {
        return foci[d.act].color;
    });

// For smoother initial transition to settling spots.
circle.transition()
    .duration(900)
    .delay(function (d, i) {
        return i * 5;
    })
    .attrTween("r", function (d) {
        var i = d3.interpolate(0, d.radius);
        return function (t) {
            return d.radius = i(t);
        };
    });


// Run function periodically to make things move.
var timeout;

function timer() {

    d3.range(nodes.length).map(function (i) {
        var curr_node = nodes[i],
            curr_moves = curr_node.moves;

        // Time to go to next activity
        if (curr_node.next_move_time === curr_minute) {

            curr_moves = (curr_moves + 1) % curr_node.sched.length;

            // Subtract from current activity count
            act_counts.children[+curr_node.act].size -= 1;

            // Move on to next activity
            curr_node.act = curr_node.sched[curr_moves].act;

            // Add to new activity count
            act_counts.children[+curr_node.act].size += 1;

            curr_node.moves = curr_moves;
            curr_node.cx = foci[curr_node.act].x;
            curr_node.cy = foci[curr_node.act].y;

            nodes[i].next_move_time += nodes[i].sched[curr_node.moves].duration;
        }
    });

    label.selectAll("tspan.actpct")
        .text(function (d) {
            return readablePercent(act_counts.children[d.index].size);
        });

    // Update time
    var true_minute = curr_minute % 1440;
    d3.select("#current_time").text(minutesToTime(true_minute));

    force.resume();
    curr_minute += 1;

    if (!REAL_TIME) {
        if (FILTER === "all") {
            update_treemap(all_summary);
        } else if (FILTER === "male") {
            update_treemap(male_summary);
        } else {
            update_treemap(female_summary);
        }
    } else {
        update_treemap(JSON.parse(JSON.stringify(act_counts)));
    }
    // Update times
    if (!PAUSE) {
        timeout = setTimeout(timer, speeds[USER_SPEED]);
    }
}


timeout = setTimeout(timer, speeds[USER_SPEED]);


//
// Force-directed boiler plate functions
//


function tick(e) {
    circle
        .each(gravity(.051 * e.alpha))
        .each(collide(.5))
        .style("fill", function (d) {
            return foci[d.act].color;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });
}


// Move nodes toward cluster focus.
function gravity(alpha) {
    return function (d) {
        d.y += (foci[d.act].y - d.y) * alpha;
        d.x += (foci[d.act].x - d.x) * alpha;
    };
}


// Resolve collisions between nodes.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
        var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.act !== quad.point.act) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}

var label = svg.selectAll("text")
    .data(act_codes)
    .enter().append("text")
    .attr("class", "actlabel")
    .attr("x", function (d, i) {
        if (d.desc === center_act) {
            return center_pt.x;
        } else {
            var theta = 2 * Math.PI / (act_codes.length - 1);
            return 340 * Math.cos(i * theta) + 380;
        }

    })
    .attr("y", function (d, i) {
        if (d.desc === center_act) {
            return center_pt.y;
        } else {
            var theta = 2 * Math.PI / (act_codes.length - 1);
            return 340 * Math.sin(i * theta) + 365;
        }

    });

label.append("tspan")
    .attr("x", function () {
        return d3.select(this.parentNode).attr("x");
    })
    // .attr("dy", "1.3em")
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d.short;
    });
label.append("tspan")
    .attr("dy", "1.3em")
    .attr("x", function () {
        return d3.select(this.parentNode).attr("x");
    })
    .attr("text-anchor", "middle")
    .attr("class", "actpct")
    .text(function (d) {
        return act_counts.children[d.index] + "%";
    });

function readablePercent(n) {
    var pct = 100 * n / sched_objs.length;
    if (pct < 1 && pct > 0) {
        pct = "<1%";
    } else {
        pct = Math.round(pct) + "%";
    }

    return pct;
}


// Minutes to time of day. Data is minutes from 4am.
function minutesToTime(m) {
    var minutes = (m + 4 * 60) % 1440;
    var hh = Math.floor(minutes / 60);
    var ampm;
    if (hh > 12) {
        hh = hh - 12;
        ampm = "pm";
    } else if (hh === 12) {
        ampm = "pm";
    } else if (hh === 0) {
        hh = 12;
        ampm = "am";
    } else {
        ampm = "am";
    }
    var mm = minutes % 60;
    if (mm < 10) {
        mm = "0" + mm;
    }

    return hh + ":" + mm + ampm
}


function update_treemap(treemap_data) {
    var treemap_container = document.getElementById("treemap");
    treemap_container.innerHTML = "";

    var treemap = d3.layout.treemap()
        .size([259, 259])
        .sticky(true)
        .value(function (d) {
            return d.size;
        });

    treemap.nodes(treemap_data);

    var div = d3.select("#treemap").append("div")
        .style("position", "relative")
        .attr("width", 259)
        .attr("height", 259);

    var cell = div.selectAll(".cell")
        .data(treemap.nodes);
        cell.exit().remove();
        cell.enter().append("div")
        .attr("class", "cell")
        .call(position)
        .style("background", function (d) {
            return d.children ? null : act_codes[d.index].color;
        }).on("mouseover", function (d) {
            if (PAUSE || !REAL_TIME) {
                mouseover(d);
            }
        })
        .on("mouseout", function () {
            d3.select("#tooltip").style("visibility", "hidden")
        });

    function mouseover(d) {
        d3.select("#tooltip")
            .style("visibility", "visible")
            .html(function () {
                if (REAL_TIME) {
                    return d.children ? null : act_codes[d.name].short + ': ' + (d.size / d.parent.value * 100).toFixed(2) + '% (' + (300 * d.size / d.parent.value).toFixed() + ' people)';
                } else {
                    return d.children ? null : act_codes[d.name].short + ': ' + (d.size / d.parent.value * 100).toFixed(2) + '% (' + (24 * d.size / d.parent.value).toFixed(2) + ' hours)';
                }
            })
            .style("top", function () {
                return (d3.event.pageY) + "px"
            })
            .style("left", function () {
                return (d3.event.pageX) + "px";
            });
    }


    function position() {
        this.style("left", function (d) {
            return d.x + "px";
        })
            .style("top", function (d) {
                return d.y + "px";
            })
            .style("width", function (d) {
                return Math.max(0, d.dx - 1) + "px";
            })
            .style("height", function (d) {
                return Math.max(0, d.dy - 1) + "px";
            });
    }
}

d3.select("#play")
    .on("click", function () {
        PAUSE = !PAUSE;
        if (PAUSE) {
            this.innerHTML = "<i class='fas fa-play'></i>";
        } else {
            this.innerHTML = "<i class='fas fa-pause'></i>";
            timer();
        }
    });

d3.selectAll(".speed_control")
    .on("click", function () {
        USER_SPEED = d3.select(this).attr("value");
    });

d3.selectAll(".view_control")
    .on("click", function () {
        if (d3.select(this).attr("value") === "realtime") {
            REAL_TIME = true;
            update_treemap(JSON.parse(JSON.stringify(act_counts)));
        } else {
            REAL_TIME = false;
            if (FILTER === "all") {
                update_treemap(all_summary);
            } else if (FILTER === "male") {
                update_treemap(male_summary);
            } else {
                update_treemap(female_summary);
            }
        }
    });

d3.selectAll(".gender_filter")
    .on("click", function () {
        FILTER = d3.select(this).attr("value");

        if (d3.select(this).attr("value") === "all") {
            sched_objs = all;
        } else if (d3.select(this).attr("value") === "male") {
            sched_objs = male;
        } else {
            sched_objs = female;
        }

        curr_minute = 0;

        act_counts = {
            "name": "act_counts",
            "children": [
                {"name": "0", "index": 0, "size": 0},
                {"name": "1", "index": 1, "size": 0},
                {"name": "2", "index": 2, "size": 0},
                {"name": "3", "index": 3, "size": 0},
                {"name": "4", "index": 4, "size": 0},
                {"name": "5", "index": 5, "size": 0},
                {"name": "6", "index": 6, "size": 0},
                {"name": "7", "index": 7, "size": 0},
                {"name": "8", "index": 8, "size": 0},
                {"name": "9", "index": 9, "size": 0},
                {"name": "10", "index": 10, "size": 0},
                {"name": "11", "index": 11, "size": 0},
                {"name": "12", "index": 12, "size": 0}
            ]
        };

        document.getElementById("chart").innerHTML = "";

        svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height);

        foci = {};

        act_index = [];

        act_codes.forEach(function (code, i) {
            act_index.push(code.short);
            if (code.desc === center_act) {
                foci[code.index] = {x: center_pt.x, y: center_pt.y, color: code.color};
            } else {
                var theta = 2 * Math.PI / (act_codes.length - 1);
                foci[code.index] = {
                    x: 250 * Math.cos(i * theta) + 380,
                    y: 250 * Math.sin(i * theta) + 365,
                    color: code.color
                };
            }
        });

// Create node objects
        nodes = sched_objs.map(function (o, i) {
            var act = o[0].act;
            act_counts.children[+act].size += 1;
            var init_x = foci[act].x + Math.random();
            var init_y = foci[act].y + Math.random();
            return {
                act: act,
                radius: 3,
                x: init_x,
                y: init_y,
                fill: foci[act].color, //color(act),
                moves: 0,
                next_move_time: o[0].duration,
                sched: o
            }
        });

// Force-directed layout
        force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(0)
            .friction(.91)
            .on("tick", tick)
            .start();

// Draw circle for each node.
        circle = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("id", function (d) {
                return d.id;
            })
            .attr("class", "node")
            .style("fill", function (d) {
                return foci[d.act].color;
            });

// For smoother initial transition to settling spots.
        circle.transition()
            .duration(900)
            .delay(function (d, i) {
                return i * 5;
            })
            .attrTween("r", function (d) {
                var i = d3.interpolate(0, d.radius);
                return function (t) {
                    return d.radius = i(t);
                };
            });

        label = svg.selectAll("text")
            .data(act_codes)
            .enter().append("text")
            .attr("class", "actlabel")
            .attr("x", function (d, i) {
                if (d.desc === center_act) {
                    return center_pt.x;
                } else {
                    var theta = 2 * Math.PI / (act_codes.length - 1);
                    return 340 * Math.cos(i * theta) + 380;
                }

            })
            .attr("y", function (d, i) {
                if (d.desc === center_act) {
                    return center_pt.y;
                } else {
                    var theta = 2 * Math.PI / (act_codes.length - 1);
                    return 340 * Math.sin(i * theta) + 365;
                }

            });

        label.append("tspan")
            .attr("x", function () {
                return d3.select(this.parentNode).attr("x");
            })
            // .attr("dy", "1.3em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.short;
            });
        label.append("tspan")
            .attr("dy", "1.3em")
            .attr("x", function () {
                return d3.select(this.parentNode).attr("x");
            })
            .attr("text-anchor", "middle")
            .attr("class", "actpct")
            .text(function (d) {
                return act_counts.children[d.index] + "%";
            });
    });