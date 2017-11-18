/**
 *
 * @param width size of the grid, in points along the x axis
 * @param height size of the grid, in points along the y axis
 * @returns A Grid object with the following API:
 *
 *  var my_grid = new Grid(100, 100);
 *  my_grid.get_point();
 *  my_grid.save_point(1, 2, true);
 *
 */
function Maptacular(width, height) {

  var self = this;

  this.init = function(width, height) {

    self.width = width;
    self.height = height;
    self.stepSize = 20;
    self.numberOfSteps = self.width / self.stepSize;

    // Setup the grid
    self.data = {
      version: 1,
      left: [],
      right: []
    };
    ['left', 'right'].map(function(side){
      for (var i = 0; i < self.width; i++) {
        self.data[side][i] = [];
        for (var j = 0; j < self.height; j++) {
          self.data[side][i][j] = null;
        }
      }
    });

  };

  this.getPotentials = function(points) {
    
  };

  /**
   *
   * Use the magic of math to return a coordinate that is both random enough
   * not to be easily predicted by the user, and close enough to other known
   * problem spots to give us better resolution of the user's void spaces.
   *
   * @param side They eye we're dealing with
   *
   * @returns {[number, number]}
   *
   */
  this.getPoint = function(side) {
    return [1, 2];
  };

  this.savePoint = function(side, x, y, value) {
    self.data[side][x][y] = value;
  };

  /**
   * https://stackoverflow.com/a/15685877/231670
   */
  this.download = function() {

    self.data.left[0][0] = 1;
    self.data.left[25][25] = 1;
    self.data.left[50][50] = 1;
    self.data.left[75][75] = 1;
    self.data.left[99][99] = 1;

    self.data.right[10][10] = 1;
    self.data.right[25][77] = 1;

    this.draw();

    var data = JSON.stringify(self.data);
    var left = document.getElementsByTagName("canvas")[0].toDataURL();
    var right = document.getElementsByTagName("canvas")[1].toDataURL();

    var doc = new jsPDF();
    doc.setFontSize(40);
    doc.text(0, 25, 'This is what I see');
    doc.addImage(left, 'PNG', 0, 50, 80, 80);
    doc.addImage(right, 'PNG', 85, 50, 80, 80);
    doc.save();

  };

  this.draw = function() {

    var heatmaps = {
      left: h337.create({
        container: document.getElementById('left-eye'),
        radius: 10,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
      }),
      right: h337.create({
        container: document.getElementById('right-eye'),
        radius: 10,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
      })
    };

    ['left', 'right'].map(function(side) {
      for (var i = 0; i < self.width; i++) {
        for (var j = 0; j < self.height; j++) {
          if (self.data[side][i][j] !== null) {
            heatmaps[side].addData({x: i * 3, y: j * 3, value: 100, radius: 10});
          }
        }
      }
    });

  };

  this.init(width, height);

  return this;

}
