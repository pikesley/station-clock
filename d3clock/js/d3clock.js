var d3clock = function (config) {

  /*
  D3 Clock
  by: Daniel Pradilla <info@danielpradilla.info>
  blog: http://danielpradilla.info

  With ideas from
  https://github.com/wout/svg.clock.js
  https://ericbullington.com/blog/2012/10/27/d3-oclock/
  http://www.infocaptor.com/dashboard/d3-javascript-visualization-to-build-world-analog-clocks
  */

  var clockGroup, fields, formatHour, formatMinute, formatSecond, height, pi, render, scaleHours, scaleSecsMins, vis, width;

  var hourOffset = 0;
  var minOffset = 0;
  var secOffset = 0;

  formatSecond = d3.time.format("%S");
  formatMinute = d3.time.format("%M");
  formatHour = d3.time.format("%H");
  width = config.width ? config.width : 720;
  height = width;
  rasp_width = 150

  var outerRadius = 0.8 * height / 2;
  var offSetX = height / 2;
  var offSetY = height / 2;

  pi = Math.PI;

  scaleSecsMins = d3.scale.linear().domain([0, 59 + 59 / 60]).range([0, 2 * pi]);
  scaleHours = d3.scale.linear().domain([0, 11 + 59 / 60]).range([0, 2 * pi]);

  fields = function (date) {
    var d, data, hour, minute, second;
    if (date) {
      d = new Date(date);
    } else {
      d = new Date();
    }
    second = d.getSeconds() + secOffset;
    minute = d.getMinutes() + minOffset;
    hour = d.getHours() + hourOffset + minute / 60;
    return data = [
      {
        "unit": "hours",
        "text": formatHour(d),
        "numeric": hour
      },
      {
        "unit": "minutes",
        "text": formatMinute(d),
        "numeric": minute
      },
      {
        "unit": "seconds",
        "text": formatSecond(d),
        "numeric": second
      }];
  };

  var setTZHours = function (hr) {
    if (hr !== undefined)
      hourOffset = hr;
  }; var setTZMins = function (min) {
    if (min !== undefined)
      minOffset = min;
  };
  var setTZSeconds = function (sec) {
    if (sec !== undefined)
      secOffset = sec;
  };

  if (config.TZOffset != undefined) {
    setTZHours(config.TZOffset.hours);
    setTZMins(config.TZOffset.mins);
    setTZSeconds(config.TZOffset.secs);
  }

  var face = 'sbb';


  //clock faces configuration
  var faces = {
    'sbb': {
      outerRing: { r: outerRadius * 1.05 },
      tickUnit: outerRadius * 0.0625 / 3,
      tickWidth: function (i) {
        return (i % 5) ? this.tickUnit : this.tickUnit * 3;
      },
      tickHeight: function (i) {
        return (i % 5) ? this.tickUnit * 3 : this.tickUnit * 3 * 3;
      },
      rotationTranslate: function (i) {
        return "translate(" + (-this.tickWidth(i) / 2) + ",0)";
      },
      clockHandx: function (d) {
        if (d.unit === "hours") {
          return -this.tickUnit * 3 * 2 / 2;
        } else if (d.unit === "minutes") {
          return -this.tickUnit * 3 * 1.5 / 2;
        } else if (d.unit === "seconds") {
          return -this.tickUnit / 2;
        }
      },
      clockHandy: function (d) {
        if (d.unit === "hours") {
          return -outerRadius + this.tickUnit * 3 * 3 + this.tickUnit * 4;
        } else if (d.unit === "minutes") {
          return -outerRadius + this.tickUnit * 3;
        } else if (d.unit === "seconds") {
          return -outerRadius + this.tickUnit * 3 * 3 + this.tickUnit * 4;
        }
      },
      clockHandWidth: function (d) {
        if (d.unit === "hours") {
          return this.tickUnit * 3 * 2;
        } else if (d.unit === "minutes") {
          return this.tickUnit * 3 * 1.5;
        } else if (d.unit === "seconds") {
          return this.tickUnit;
        }
      },
      clockHandHeight: function (d) {
        if (d.unit === "hours") {
          return (outerRadius - this.tickUnit * 3 * 3) * 1.2;
        } else if (d.unit === "minutes") {
          return outerRadius * 1.2;
        } else if (d.unit === "seconds") {
          return (outerRadius - this.tickUnit * 3 * 3) * 1.2;
        }
      },
      clockHandAdditional: function (clockHand) {
        var that = this;
        clockHand.append("svg:circle").attr("r", function (d, i) {
          if (d.unit === "hours") {
            return 0;
          } else if (d.unit === "minutes") {
            return 0;
          } else if (d.unit === "seconds") {
            return that.tickUnit * 4;
          }
        })
          .attr('cy', function (d, i) {
            return -outerRadius + that.tickUnit * 3 * 3 + that.tickUnit * 4
          })
          .attr("class", "seconds hands");
      },
      clockGroupAdditional: function (clockGroup) {
        return true;
      },
      easing: 'linear'
    },
  };

  var faceObj = faces[face];

  //create the basic visualization:
  vis = d3.select(config.target).append("svg:svg").attr("width", width).attr("height", height).attr("class", "clock");

  // my bumbling begins here
  raspberry(vis, offSetX)

  text = [
    [
      "text-heading", "RASPBERRY PI", 2
    ],
    [
      "text-subheading", "· CAMBRIDGE ·", 2.5
    ],
  ]

  text.forEach(function (data) {
    // https://www.d3-graph-gallery.com/graph/shape.html
    vis.append("path")
      .attr("id", data[0])
      .attr("transform", "translate(" + offSetX + "," + offSetY + ")")
      .attr("d", d3.svg.arc()
        .innerRadius(faceObj.outerRing.r / data[2])
        .outerRadius(faceObj.outerRing.r / data[2])
        .startAngle(-Math.PI)
        .endAngle(Math.PI)
      )

    // https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html
    vis.append("text")
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", "#" + data[0]) //place the ID of the path here
      .style("text-anchor", "middle") //place the text halfway on the arc
      .attr("startOffset", "25%")
      .attr("class", data[0])
      .text(data[1])
  })
  // end of my bumbling

  clockGroup = vis.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")");

  //create the outer circle of the clock face
  clockGroup.append("svg:circle")
    .attr("r", faceObj.outerRing.r)
    .attr("fill", "none")
    .attr("class", "clock outercircle")

  faceObj.clockGroupAdditional(clockGroup);

  //create the minutes and hours ticks
  tickGroup = clockGroup.append("svg:g")
    .selectAll(".tick")
    .data(d3.range(60))
    .enter();

  tickGroup.append("svg:rect")
    .attr("class", "tick")
    .attr("x", 0)
    .attr("y", -outerRadius)
    // .attr("width", function(d, i){return (i%5) ? 0 : 1;})
    .attr("width", function (d, i) { return faceObj.tickWidth(i); })
    .attr("height", function (d, i) { return faceObj.tickHeight(i); })
    .attr("class", function (d, i) { return "tick" })
    .attr("transform", function (d, i) {
      return "rotate(" + (i * 6) + ")," + faceObj.rotationTranslate(i);
    }
    );

  if (faceObj.tickText) {
    var radian = function (i) { return 6 * i * (Math.PI / 180) - (90 * Math.PI / 180); }
    tickGroup
      .append("text")
      .attr("class", "tick")
      .attr("x", function (d, i) {
        var xPos = Math.cos(radian(i));
        var pos = Math.round(100 * xPos); //>0, <0, 0
        if (pos > 0) {
          return (outerRadius - faceObj.tickHeight(i) - faceObj.tickText.fontSize) * xPos;
        } else if (pos < 0) {
          return (outerRadius - faceObj.tickText.fontSize / 1.2) * xPos;
        } else {
          return -faceObj.tickText.fontSize * ('' + faceObj.tickText.fn(i)).length / 2 + ('' + faceObj.tickText.fn(i)).length * faceObj.tickText.fontSize / 5;
        }
      })
      .attr("y", function (d, i) {
        var yPos = Math.sin(radian(i));
        var pos = Math.round(100 * yPos);
        if (pos > 0) {
          return (outerRadius - faceObj.tickText.fontSize) * yPos;
        } else if (pos < 0) {
          return (outerRadius - faceObj.tickHeight(i) - faceObj.tickText.fontSize) * yPos;
        } else {
          return faceObj.tickText.fontSize / 3;
        }
      })

      .attr("font-family", faceObj.tickText.fontFamily)
      .attr("font-size", faceObj.tickText.fontSize)
      .text(function (d, i) { return faceObj.tickText.fn(i); });
  }

  if (faceObj.tickTextRotated) {
    tickGroup
      .append("text")
      .attr("class", "tick")
      .attr("x", function (i) { return faceObj.tickTextX(i); })
      .attr("y", function (i) { return -outerRadius + faceObj.tickHeight(i) * 2.5; })
      .attr("font-family", faceObj.tickTextRotated.fontFamily)
      .attr("font-size", faceObj.tickTextRotated.fontSize)
      .text(function (d, i) { return faceObj.tickTextRotated.fn(i); })
      .attr("transform", function (d, i) {
        return "rotate(" + (i * 6) + ")," + faceObj.rotationTranslate(i);
      }
      );
  }



  render = function (data) {
    //render / update the clock hands

    var clockHand = clockGroup.selectAll(".clockhand").data(data);
    if (!clockHand[0][0]) {
      //draw the hands if not drawn
      clockHand.remove();
      clockHand.enter().append("svg:g");
      clockHand.attr("class", function (d) {
        return "clockhand hands " + d.unit;
      }).append("svg:rect").attr("x", function (d, i) {
        return faceObj.clockHandx(d);
      })
        .attr("y", function (d, i) {
          return faceObj.clockHandy(d);
        })
        .attr("width", function (d, i) {
          return faceObj.clockHandWidth(d);
        })
        .attr("class", function (d, i) {
          return d;
        })
        .attr("height", function (d, i) {
          return faceObj.clockHandHeight(d);
        });
    }

    clockHand.transition().duration(1000).ease(faceObj.easing).attr("transform", function (d, i) {
      if (d.unit === "hours") {
        return "rotate(" + d.numeric % 12 * 30 + ")";
      } else {
        return "rotate(" + d.numeric * 6 + ")";
      }
    });

    faceObj.clockHandAdditional(clockHand);


  };

  if (config.date) {
    var data = fields(config.date);
    render(data);
  } else {
    setInterval(function () {
      var data = fields();
      return render(data);
    }, 1000);
  }

};
