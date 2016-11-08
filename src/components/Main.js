require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

var imageData = require('../data/imageData.json');

imageData = (function genImageUrl(imageDataArr) {
  for (var i = 0, j = imageDataArr.length; i < j; i++) {
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageData);


class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};

    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //if the rotate deg is non-zero, set rotate deg
    if (this.props.arrange.rotate) {
      (['Moz', 'ms', 'Webkit', '']).forEach(function (value) {
        if (value !== '') {
          styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        } else {
          styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }

      }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.description}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    var controllerUnitClassName = 'controller-unit';
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}

class AppComponent extends React.Component {
  Constant = {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /*        {
         pos: {
         left: '0',
         top: '0'
         },
         rotate: 0,
         isInverse: false,
         isCenter: false,
         }*/
      ]
    };
  }

  static getRangeRandom(low, high) {
    return Math.floor(low + Math.random() * (high - low));
  }

  static get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
  }

  /*
   flip the image
   @param index
   @return {Function}*/
  inverse(index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({imgsArrangeArr});
    }.bind(this);
  }

  center(index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  }

  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //put centerIndex image at the center position,no need to rotate
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //get top elements
    topImgSpliceIndex = Math.floor(Math.random * (imgsArrangeArr.length + 1 - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //set position for top elements
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: AppComponent.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: AppComponent.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: AppComponent.get30DegRandom(),
        isCenter: false
      };
    });


    //set position for left and right section elements
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLOrRX = null;

      if (i < k) {
        hPosRangeLOrRX = hPosRangeLeftSecX;
      } else {
        hPosRangeLOrRX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.constructor.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.constructor.getRangeRandom(hPosRangeLOrRX[0], hPosRangeLOrRX[1])
        },
        rotate: this.constructor.get30DegRandom(),
        isCenter: false
      };
    }


    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({imgsArrangeArr});

  }

  componentDidMount() {
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    var stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    var imgFigures = [],
      controllerUnits = [];

    imageData.forEach(function (value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }

      imgFigures.push(<ImgFigure data={value} key={value.fileName} ref={'imgFigure'+index}
                                 arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                 center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit key={index.toString()} arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));


    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }

}

AppComponent.defaultProps = {};

export default AppComponent;
