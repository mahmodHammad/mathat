import * as THREE from "./modules/three.module.js";

class SpriteText extends THREE.Sprite {
  constructor(
    text = "",
    textHeight = 10,
    color = "rgba(255, 255, 255, 1)",
    name = 10,
    target,
    kind
  ) {
    super(new THREE.SpriteMaterial({ map: new THREE.Texture() }));
    this.name = name;
    this.target = target;
    this.kind = kind;
    // intit START-------------------------------------------------
    this._text = `${text}`;
    this._textHeight = textHeight;
    this._color = color;
    this._backgroundColor = false; // no background color

    this._padding = 0;
    this._borderWidth = 0;
    this._borderColor = "green";

    this._strokeWidth = 0;
    this._strokeColor = "white";

    this._fontFace = "Arial";
    this._fontSize = 90; // defines text resolution
    this._fontWeight = "normal";
    // intit END--------------------------------------------------

    this._canvas = document.createElement("canvas");
    this._texture = this.material.map;
    this._texture.minFilter = THREE.LinearFilter;

    this._genCanvas();
  }

  get text() {
    return this._text;
  }
  set text(text) {
    this._text = text;
    this._genCanvas();
  }
  get textHeight() {
    return this._textHeight;
  }
  set textHeight(textHeight) {
    this._textHeight = textHeight;
    this._genCanvas();
  }
  get color() {
    return this._color;
  }
  set color(color) {
    this._color = color;
    this._genCanvas();
  }
  get backgroundColor() {
    return this._backgroundColor;
  }
  set backgroundColor(color) {
    this._backgroundColor = color;
    this._genCanvas();
  }
  get padding() {
    return this._padding;
  }
  set padding(padding) {
    this._padding = padding;
    this._genCanvas();
  }
  get borderWidth() {
    return this._borderWidth;
  }
  set borderWidth(borderWidth) {
    this._borderWidth = borderWidth;
    this._genCanvas();
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(borderColor) {
    this._borderColor = borderColor;
    this._genCanvas();
  }
  get fontFace() {
    return this._fontFace;
  }
  set fontFace(fontFace) {
    this._fontFace = fontFace;
    this._genCanvas();
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(fontSize) {
    this._fontSize = fontSize;
    this._genCanvas();
  }
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(fontWeight) {
    this._fontWeight = fontWeight;
    this._genCanvas();
  }
  get strokeWidth() {
    return this._strokeWidth;
  }
  set strokeWidth(strokeWidth) {
    this._strokeWidth = strokeWidth;
    this._genCanvas();
  }
  get strokeColor() {
    return this._strokeColor;
  }
  set strokeColor(strokeColor) {
    this._strokeColor = strokeColor;
    this._genCanvas();
  }

  _genCanvas() {
    const canvas = this._canvas;
    const ctx = canvas.getContext("2d");

    const border = Array.isArray(this.borderWidth)
      ? this.borderWidth
      : [this.borderWidth, this.borderWidth]; // x,y border
    const relBorder = border.map((b) => b * this.fontSize * 0.1); // border in canvas units

    const padding = Array.isArray(this.padding)
      ? this.padding
      : [this.padding, this.padding]; // x,y padding
    const relPadding = padding.map((p) => p * this.fontSize * 0.1); // padding in canvas units

    const lines = this.text.split("\n");
    const font = `${this.fontWeight} ${this.fontSize}px ${this.fontFace}`;

    ctx.font = font; // measure canvas with appropriate font
    const innerWidth = Math.max(
      ...lines.map((line) => ctx.measureText(line).width)
    );
    const innerHeight = this.fontSize * lines.length;
    canvas.width = innerWidth + relBorder[0] * 2 + relPadding[0] * 2;
    canvas.height = innerHeight + relBorder[1] * 2 + relPadding[1] * 2;
    // paint border
    if (this.borderWidth) {
      ctx.strokeStyle = this.borderColor;
      const shift = 10;

      if (relBorder[0]) {
        ctx.lineWidth = relBorder[0] * 2;
        ctx.beginPath();
        ctx.moveTo(-shift, 0);
        ctx.lineTo(-shift, canvas.height);
        ctx.moveTo(shift + canvas.width, 0);
        ctx.lineTo(shift + canvas.width, canvas.height);
        ctx.stroke();
      }

      if (relBorder[1]) {
        ctx.lineWidth = relBorder[1] * 2;
        ctx.beginPath();
        ctx.moveTo(-shift + relBorder[0], -shift);
        ctx.lineTo(shift + canvas.width - relBorder[0], -shift);
        ctx.moveTo(-shift + relBorder[0], shift + canvas.height);
        ctx.lineTo(shift + canvas.width - relBorder[0], shift + canvas.height);
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.fillStyle = "#0005";
      ctx.strokeStyle = this.borderColor;

      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height / 2.8,
        0,
        2 * Math.PI
      );
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.fill();
    }

    ctx.translate(...relBorder);

    // paint background
    if (this.backgroundColor) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(
        0,
        0,
        canvas.width - relBorder[0] * 2,
        canvas.height - relBorder[1] * 2
      );
    }

    ctx.translate(...relPadding);

    // paint text
    ctx.font = font; // Set font again after canvas is resized, as context properties are reset
    ctx.fillStyle = this.color;
    ctx.textBaseline = "bottom";

    const drawTextStroke = this.strokeWidth > 0;
    if (drawTextStroke) {
      ctx.lineWidth = (this.strokeWidth * this.fontSize) / 10;
      ctx.strokeStyle = this.strokeColor;
    }

    lines.forEach((line, index) => {
      const lineX = (innerWidth - ctx.measureText(line).width) / 2;
      const lineY = (index + 1) * this.fontSize;

      drawTextStroke && ctx.strokeText(line, lineX, lineY);
      ctx.fillText(line, lineX, lineY);
    });

    // Inject canvas into sprite
    this._texture.image = canvas;
    this._texture.needsUpdate = true;

    const yScale =
      this.textHeight * lines.length + border[1] * 2 + padding[1] * 2;
    this.scale
      .set((yScale * canvas.width) / canvas.height, yScale, 0)
      .multiplyScalar(0.0013);
      // .multiplyScalar(0.0008);
  }
}

function makeNumberSprite(
  text,
  color,
  backgroundColor,
  padding,
  fontweight,
  borderWidth,
  borderColor,
  target,
  scale=1.24
) {
  var myText = new SpriteText(text, 20, color, target.label, target);

  myText.backgroundColor = backgroundColor;
  myText.padding = padding;
  myText.fontWeight = fontweight;
  myText.borderWidth = borderWidth;
  myText.borderColor = borderColor;

  myText.scale.multiplyScalar(scale);

  return myText;
}

function makeTextSprite(
  text,
  color,
  backgroundColor,
  padding,
  fontweight,
  borderWidth,
  borderColor,
  target,
  scale=1.24
) {
  var myText = new SpriteText(text, 20, color, undefined, target, "label");
  myText.backgroundColor = backgroundColor;
  myText.padding = padding;
  myText.fontWeight = fontweight;
  myText.borderWidth = borderWidth;
  myText.borderColor = borderColor;
  myText.scale.multiplyScalar(scale);

  // myText.scale.set(0.1, 0.035, 1.0);

  return myText;
}

export { makeNumberSprite, makeTextSprite };
