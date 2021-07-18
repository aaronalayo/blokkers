
var _0xacdc = [
  "\x70\x6C\x61\x79",
  "\x69\x6E\x74\x72\x6F\x2D\x76\x69\x64\x65\x6F",
  "\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64",
  "\x6C\x65\x6E\x67\x74\x68",
  "\x2E\x70\x61\x67\x65",
  "\x73\x63\x72\x6F\x6C\x6C\x54\x6F\x70",
  "\x74\x6F\x70",
  "\x6F\x66\x66\x73\x65\x74",
  "\x6A\x73\x6F\x6E",
  "\x2F\x63\x61\x72\x74",
  "",
  "\x6E\x6F\x20\x64\x61\x74\x61",
  "\x6C\x6F\x67",
  "\x70\x6F\x73\x74\x65\x72\x73",
  "\x63\x61\x72\x74",
  "\x73\x74\x72\x69\x6E\x67\x69\x66\x79",
  "\x73\x65\x74\x49\x74\x65\x6D",
  "\x74\x68\x65\x6E",
];
function playVideo() {
  document[_0xacdc[2]](_0xacdc[1])[_0xacdc[0]]();
  for (let _0xc3e8x2 = 0; _0xc3e8x2 < $(_0xacdc[4])[_0xacdc[3]]; _0xc3e8x2++) {
    let _0xc3e8x3 = $(_0xacdc[4])[_0xc3e8x2];
    if ($(document)[_0xacdc[5]]() >= $(_0xc3e8x3)[_0xacdc[7]]()[_0xacdc[6]]) {
      currentPos = _0xc3e8x2;
    }
  }
}
function getCart() {
  const _0xc3e8x5 = async (_0xc3e8x6) => {
    const _0xc3e8x7 = await fetch(_0xc3e8x6);
    return _0xc3e8x7[_0xacdc[8]]();
  };
  return new Promise(function (_0xc3e8x8) {
    const _0xc3e8x9 = _0xc3e8x5(_0xacdc[9]);
    setTimeout(function () {
      _0xc3e8x8(_0xc3e8x9);
    }, 200);
  });
}
async function setCart() {
  try {
    await getCart()[_0xacdc[17]]((_0xc3e8xb) => {
      if (
        typeof _0xc3e8xb === undefined ||
        !_0xc3e8xb ||
        _0xc3e8xb === _0xacdc[10] ||
        _0xc3e8xb[_0xacdc[3]] < 1
      ) {
        console[_0xacdc[12]](_0xacdc[11]);
      } else {
        sessionStorage[_0xacdc[16]](
          _0xacdc[13],
          JSON[_0xacdc[15]](_0xc3e8xb[_0xacdc[14]])
        );
      }
    });
  } catch (error) {
    console[_0xacdc[12]](error);
  }
}
