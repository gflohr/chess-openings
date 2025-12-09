import * as fs from 'node:fs/promises';
import { Book } from '../book';
import { Uint64BE } from 'int64-buffer';
import { Entry } from '../entry';
import { parseFEN, pieceMapping, EPSquare } from '../../fen-parser';

const random64 = [
	new Uint64BE(0x9d39247e, 0x33776d41),
	new Uint64BE(0x2af73980, 0x05aaa5c7),
	new Uint64BE(0x44db0150, 0x24623547),
	new Uint64BE(0x9c15f73e, 0x62a76ae2),
	new Uint64BE(0x75834465, 0x489c0c89),
	new Uint64BE(0x3290ac3a, 0x203001bf),
	new Uint64BE(0x0fbbad1f, 0x61042279),
	new Uint64BE(0xe83a908f, 0xf2fb60ca),
	new Uint64BE(0x0d7e765d, 0x58755c10),
	new Uint64BE(0x1a083822, 0xceafe02d),
	new Uint64BE(0x9605d5f0, 0xe25ec3b0),
	new Uint64BE(0xd021ff5c, 0xd13a2ed5),
	new Uint64BE(0x40bdf15d, 0x4a672e32),
	new Uint64BE(0x01135514, 0x6fd56395),
	new Uint64BE(0x5db48320, 0x46f3d9e5),
	new Uint64BE(0x239f8b2d, 0x7ff719cc),
	new Uint64BE(0x05d1a1ae, 0x85b49aa1),
	new Uint64BE(0x679f848f, 0x6e8fc971),
	new Uint64BE(0x7449bbff, 0x801fed0b),
	new Uint64BE(0x7d11cdb1, 0xc3b7adf0),
	new Uint64BE(0x82c7709e, 0x781eb7cc),
	new Uint64BE(0xf3218f1c, 0x9510786c),
	new Uint64BE(0x331478f3, 0xaf51bbe6),
	new Uint64BE(0x4bb38de5, 0xe7219443),
	new Uint64BE(0xaa649c6e, 0xbcfd50fc),
	new Uint64BE(0x8dbd98a3, 0x52afd40b),
	new Uint64BE(0x87d2074b, 0x81d79217),
	new Uint64BE(0x19f3c751, 0xd3e92ae1),
	new Uint64BE(0xb4ab30f0, 0x62b19abf),
	new Uint64BE(0x7b0500ac, 0x42047ac4),
	new Uint64BE(0xc9452ca8, 0x1a09d85d),
	new Uint64BE(0x24aa6c51, 0x4da27500),
	new Uint64BE(0x4c9f3442, 0x7501b447),
	new Uint64BE(0x14a68fd7, 0x3c910841),
	new Uint64BE(0xa71b9b83, 0x461cbd93),
	new Uint64BE(0x03488b95, 0xb0f1850f),
	new Uint64BE(0x637b2b34, 0xff93c040),
	new Uint64BE(0x09d1bc9a, 0x3dd90a94),
	new Uint64BE(0x35756683, 0x34a1dd3b),
	new Uint64BE(0x735e2b97, 0xa4c45a23),
	new Uint64BE(0x18727070, 0xf1bd400b),
	new Uint64BE(0x1fcbacd2, 0x59bf02e7),
	new Uint64BE(0xd310a7c2, 0xce9b6555),
	new Uint64BE(0xbf983fe0, 0xfe5d8244),
	new Uint64BE(0x9f74d14f, 0x7454a824),
	new Uint64BE(0x51ebdc4a, 0xb9ba3035),
	new Uint64BE(0x5c82c505, 0xdb9ab0fa),
	new Uint64BE(0xfcf7fe8a, 0x3430b241),
	new Uint64BE(0x3253a729, 0xb9ba3dde),
	new Uint64BE(0x8c74c368, 0x081b3075),
	new Uint64BE(0xb9bc6c87, 0x167c33e7),
	new Uint64BE(0x7ef48f2b, 0x83024e20),
	new Uint64BE(0x11d505d4, 0xc351bd7f),
	new Uint64BE(0x6568fca9, 0x2c76a243),
	new Uint64BE(0x4de0b0f4, 0x0f32a7b8),
	new Uint64BE(0x96d69346, 0x0cc37e5d),
	new Uint64BE(0x42e240cb, 0x63689f2f),
	new Uint64BE(0x6d2bdcda, 0xe2919661),
	new Uint64BE(0x42880b02, 0x36e4d951),
	new Uint64BE(0x5f0f4a58, 0x98171bb6),
	new Uint64BE(0x39f890f5, 0x79f92f88),
	new Uint64BE(0x93c5b5f4, 0x7356388b),
	new Uint64BE(0x63dc359d, 0x8d231b78),
	new Uint64BE(0xec16ca8a, 0xea98ad76),
	new Uint64BE(0x5355f900, 0xc2a82dc7),
	new Uint64BE(0x07fb9f85, 0x5a997142),
	new Uint64BE(0x5093417a, 0xa8a7ed5e),
	new Uint64BE(0x7bcbc38d, 0xa25a7f3c),
	new Uint64BE(0x19fc8a76, 0x8cf4b6d4),
	new Uint64BE(0x637a7780, 0xdecfc0d9),
	new Uint64BE(0x8249a47a, 0xee0e41f7),
	new Uint64BE(0x79ad6955, 0x01e7d1e8),
	new Uint64BE(0x14acbaf4, 0x777d5776),
	new Uint64BE(0xf145b6be, 0xccdea195),
	new Uint64BE(0xdabf2ac8, 0x201752fc),
	new Uint64BE(0x24c3c94d, 0xf9c8d3f6),
	new Uint64BE(0xbb6e2924, 0xf03912ea),
	new Uint64BE(0x0ce26c0b, 0x95c980d9),
	new Uint64BE(0xa49cd132, 0xbfbf7cc4),
	new Uint64BE(0xe99d662a, 0xf4243939),
	new Uint64BE(0x27e6ad78, 0x91165c3f),
	new Uint64BE(0x8535f040, 0xb9744ff1),
	new Uint64BE(0x54b3f4fa, 0x5f40d873),
	new Uint64BE(0x72b12c32, 0x127fed2b),
	new Uint64BE(0xee954d3c, 0x7b411f47),
	new Uint64BE(0x9a85ac90, 0x9a24eaa1),
	new Uint64BE(0x70ac4cd9, 0xf04f21f5),
	new Uint64BE(0xf9b89d3e, 0x99a075c2),
	new Uint64BE(0x87b3e2b2, 0xb5c907b1),
	new Uint64BE(0xa366e5b8, 0xc54f48b8),
	new Uint64BE(0xae4a9346, 0xcc3f7cf2),
	new Uint64BE(0x1920c04d, 0x47267bbd),
	new Uint64BE(0x87bf02c6, 0xb49e2ae9),
	new Uint64BE(0x092237ac, 0x237f3859),
	new Uint64BE(0xff07f64e, 0xf8ed14d0),
	new Uint64BE(0x8de8dca9, 0xf03cc54e),
	new Uint64BE(0x9c163326, 0x4db49c89),
	new Uint64BE(0xb3f22c3d, 0x0b0b38ed),
	new Uint64BE(0x390e5fb4, 0x4d01144b),
	new Uint64BE(0x5bfea5b4, 0x712768e9),
	new Uint64BE(0x1e103291, 0x1fa78984),
	new Uint64BE(0x9a74acb9, 0x64e78cb3),
	new Uint64BE(0x4f80f7a0, 0x35dafb04),
	new Uint64BE(0x6304d09a, 0x0b3738c4),
	new Uint64BE(0x2171e646, 0x83023a08),
	new Uint64BE(0x5b9b63eb, 0x9ceff80c),
	new Uint64BE(0x506aacf4, 0x89889342),
	new Uint64BE(0x1881afc9, 0xa3a701d6),
	new Uint64BE(0x65030804, 0x40750644),
	new Uint64BE(0xdfd39533, 0x9cdbf4a7),
	new Uint64BE(0xef927dbc, 0xf00c20f2),
	new Uint64BE(0x7b32f7d1, 0xe03680ec),
	new Uint64BE(0xb9fd7620, 0xe7316243),
	new Uint64BE(0x05a7e8a5, 0x7db91b77),
	new Uint64BE(0xb5889c6e, 0x15630a75),
	new Uint64BE(0x4a750a09, 0xce9573f7),
	new Uint64BE(0xcf464cec, 0x899a2f8a),
	new Uint64BE(0xf538639c, 0xe705b824),
	new Uint64BE(0x3c79a0ff, 0x5580ef7f),
	new Uint64BE(0xede6c87f, 0x8477609d),
	new Uint64BE(0x799e81f0, 0x5bc93f31),
	new Uint64BE(0x86536b8c, 0xf3428a8c),
	new Uint64BE(0x97d7374c, 0x60087b73),
	new Uint64BE(0xa246637c, 0xff328532),
	new Uint64BE(0x043fcae6, 0x0cc0eba0),
	new Uint64BE(0x920e4495, 0x35dd359e),
	new Uint64BE(0x70eb093b, 0x15b290cc),
	new Uint64BE(0x73a19219, 0x16591cbd),
	new Uint64BE(0x56436c9f, 0xe1a1aa8d),
	new Uint64BE(0xefac4b70, 0x633b8f81),
	new Uint64BE(0xbb215798, 0xd45df7af),
	new Uint64BE(0x45f20042, 0xf24f1768),
	new Uint64BE(0x930f80f4, 0xe8eb7462),
	new Uint64BE(0xff6712ff, 0xcfd75ea1),
	new Uint64BE(0xae623fd6, 0x7468aa70),
	new Uint64BE(0xdd2c5bc8, 0x4bc8d8fc),
	new Uint64BE(0x7eed120d, 0x54cf2dd9),
	new Uint64BE(0x22fe5454, 0x01165f1c),
	new Uint64BE(0xc91800e9, 0x8fb99929),
	new Uint64BE(0x808bd68e, 0x6ac10365),
	new Uint64BE(0xdec46814, 0x5b7605f6),
	new Uint64BE(0x1bede3a3, 0xaef53302),
	new Uint64BE(0x43539603, 0xd6c55602),
	new Uint64BE(0xaa969b5c, 0x691ccb7a),
	new Uint64BE(0xa87832d3, 0x92efee56),
	new Uint64BE(0x65942c7b, 0x3c7e11ae),
	new Uint64BE(0xded2d633, 0xcad004f6),
	new Uint64BE(0x21f08570, 0xf420e565),
	new Uint64BE(0xb415938d, 0x7da94e3c),
	new Uint64BE(0x91b859e5, 0x9ecb6350),
	new Uint64BE(0x10cff333, 0xe0ed804a),
	new Uint64BE(0x28aed140, 0xbe0bb7dd),
	new Uint64BE(0xc5cc1d89, 0x724fa456),
	new Uint64BE(0x5648f680, 0xf11a2741),
	new Uint64BE(0x2d255069, 0xf0b7dab3),
	new Uint64BE(0x9bc5a38e, 0xf729abd4),
	new Uint64BE(0xef2f0543, 0x08f6a2bc),
	new Uint64BE(0xaf2042f5, 0xcc5c2858),
	new Uint64BE(0x480412ba, 0xb7f5be2a),
	new Uint64BE(0xaef3af4a, 0x563dfe43),
	new Uint64BE(0x19afe59a, 0xe451497f),
	new Uint64BE(0x52593803, 0xdff1e840),
	new Uint64BE(0xf4f076e6, 0x5f2ce6f0),
	new Uint64BE(0x11379625, 0x747d5af3),
	new Uint64BE(0xbce5d224, 0x8682c115),
	new Uint64BE(0x9da4243d, 0xe836994f),
	new Uint64BE(0x066f70b3, 0x3fe09017),
	new Uint64BE(0x4dc4de18, 0x9b671a1c),
	new Uint64BE(0x51039ab7, 0x712457c3),
	new Uint64BE(0xc07a3f80, 0xc31fb4b4),
	new Uint64BE(0xb46ee9c5, 0xe64a6e7c),
	new Uint64BE(0xb3819a42, 0xabe61c87),
	new Uint64BE(0x21a00793, 0x3a522a20),
	new Uint64BE(0x2df16f76, 0x1598aa4f),
	new Uint64BE(0x763c4a13, 0x71b368fd),
	new Uint64BE(0xf793c467, 0x02e086a0),
	new Uint64BE(0xd7288e01, 0x2aeb8d31),
	new Uint64BE(0xde336a2a, 0x4bc1c44b),
	new Uint64BE(0x0bf692b3, 0x8d079f23),
	new Uint64BE(0x2c604a7a, 0x177326b3),
	new Uint64BE(0x4850e73e, 0x03eb6064),
	new Uint64BE(0xcfc447f1, 0xe53c8e1b),
	new Uint64BE(0xb05ca3f5, 0x64268d99),
	new Uint64BE(0x9ae182c8, 0xbc9474e8),
	new Uint64BE(0xa4fc4bd4, 0xfc5558ca),
	new Uint64BE(0xe755178d, 0x58fc4e76),
	new Uint64BE(0x69b97db1, 0xa4c03dfe),
	new Uint64BE(0xf9b5b7c4, 0xacc67c96),
	new Uint64BE(0xfc6a82d6, 0x4b8655fb),
	new Uint64BE(0x9c684cb6, 0xc4d24417),
	new Uint64BE(0x8ec97d29, 0x17456ed0),
	new Uint64BE(0x6703df9d, 0x2924e97e),
	new Uint64BE(0xc547f57e, 0x42a7444e),
	new Uint64BE(0x78e37644, 0xe7cad29e),
	new Uint64BE(0xfe9a44e9, 0x362f05fa),
	new Uint64BE(0x08bd35cc, 0x38336615),
	new Uint64BE(0x9315e5eb, 0x3a129ace),
	new Uint64BE(0x94061b87, 0x1e04df75),
	new Uint64BE(0xdf1d9f9d, 0x784ba010),
	new Uint64BE(0x3bba57b6, 0x8871b59d),
	new Uint64BE(0xd2b7adee, 0xded1f73f),
	new Uint64BE(0xf7a255d8, 0x3bc373f8),
	new Uint64BE(0xd7f4f244, 0x8c0ceb81),
	new Uint64BE(0xd95be88c, 0xd210ffa7),
	new Uint64BE(0x336f52f8, 0xff4728e7),
	new Uint64BE(0xa74049da, 0xc312ac71),
	new Uint64BE(0xa2f61bb6, 0xe437fdb5),
	new Uint64BE(0x4f2a5cb0, 0x7f6a35b3),
	new Uint64BE(0x87d380bd, 0xa5bf7859),
	new Uint64BE(0x16b9f7e0, 0x6c453a21),
	new Uint64BE(0x7ba2484c, 0x8a0fd54e),
	new Uint64BE(0xf3a678ca, 0xd9a2e38c),
	new Uint64BE(0x39b0bf7d, 0xde437ba2),
	new Uint64BE(0xfcaf55c1, 0xbf8a4424),
	new Uint64BE(0x18fcf680, 0x573fa594),
	new Uint64BE(0x4c0563b8, 0x9f495ac3),
	new Uint64BE(0x40e08793, 0x1a00930d),
	new Uint64BE(0x8cffa941, 0x2eb642c1),
	new Uint64BE(0x68ca3905, 0x3261169f),
	new Uint64BE(0x7a1ee967, 0xd27579e2),
	new Uint64BE(0x9d1d60e5, 0x076f5b6f),
	new Uint64BE(0x3810e399, 0xb6f65ba2),
	new Uint64BE(0x32095b6d, 0x4ab5f9b1),
	new Uint64BE(0x35cab621, 0x09dd038a),
	new Uint64BE(0xa90b2449, 0x9fcfafb1),
	new Uint64BE(0x77a225a0, 0x7cc2c6bd),
	new Uint64BE(0x513e5e63, 0x4c70e331),
	new Uint64BE(0x4361c0ca, 0x3f692f12),
	new Uint64BE(0xd941aca4, 0x4b20a45b),
	new Uint64BE(0x528f7c86, 0x02c5807b),
	new Uint64BE(0x52ab92be, 0xb9613989),
	new Uint64BE(0x9d1dfa2e, 0xfc557f73),
	new Uint64BE(0x722ff175, 0xf572c348),
	new Uint64BE(0x1d1260a5, 0x1107fe97),
	new Uint64BE(0x7a249a57, 0xec0c9ba2),
	new Uint64BE(0x04208fe9, 0xe8f7f2d6),
	new Uint64BE(0x5a110c60, 0x58b920a0),
	new Uint64BE(0x0cd9a497, 0x658a5698),
	new Uint64BE(0x56fd23c8, 0xf9715a4c),
	new Uint64BE(0x284c847b, 0x9d887aae),
	new Uint64BE(0x04feabfb, 0xbdb619cb),
	new Uint64BE(0x742e1e65, 0x1c60ba83),
	new Uint64BE(0x9a9632e6, 0x5904ad3c),
	new Uint64BE(0x881b82a1, 0x3b51b9e2),
	new Uint64BE(0x506e6744, 0xcd974924),
	new Uint64BE(0xb0183db5, 0x6ffc6a79),
	new Uint64BE(0x0ed9b915, 0xc66ed37e),
	new Uint64BE(0x5e11e86d, 0x5873d484),
	new Uint64BE(0xf678647e, 0x3519ac6e),
	new Uint64BE(0x1b85d488, 0xd0f20cc5),
	new Uint64BE(0xdab9fe65, 0x25d89021),
	new Uint64BE(0x0d151d86, 0xadb73615),
	new Uint64BE(0xa865a54e, 0xdcc0f019),
	new Uint64BE(0x93c42566, 0xaef98ffb),
	new Uint64BE(0x99e7afea, 0xbe000731),
	new Uint64BE(0x48cbff08, 0x6ddf285a),
	new Uint64BE(0x7f9b6af1, 0xebf78baf),
	new Uint64BE(0x58627e1a, 0x149bba21),
	new Uint64BE(0x2cd16e2a, 0xbd791e33),
	new Uint64BE(0xd363eff5, 0xf0977996),
	new Uint64BE(0x0ce2a38c, 0x344a6eed),
	new Uint64BE(0x1a804aad, 0xb9cfa741),
	new Uint64BE(0x907f3042, 0x1d78c5de),
	new Uint64BE(0x501f65ed, 0xb3034d07),
	new Uint64BE(0x37624ae5, 0xa48fa6e9),
	new Uint64BE(0x957baf61, 0x700cff4e),
	new Uint64BE(0x3a6c2793, 0x4e31188a),
	new Uint64BE(0xd4950353, 0x6abca345),
	new Uint64BE(0x088e0495, 0x89c432e0),
	new Uint64BE(0xf943aee7, 0xfebf21b8),
	new Uint64BE(0x6c3b8e3e, 0x336139d3),
	new Uint64BE(0x364f6ffa, 0x464ee52e),
	new Uint64BE(0xd60f6dce, 0xdc314222),
	new Uint64BE(0x56963b0d, 0xca418fc0),
	new Uint64BE(0x16f50edf, 0x91e513af),
	new Uint64BE(0xef195591, 0x4b609f93),
	new Uint64BE(0x565601c0, 0x364e3228),
	new Uint64BE(0xecb53939, 0x887e8175),
	new Uint64BE(0xbac7a9a1, 0x8531294b),
	new Uint64BE(0xb344c470, 0x397bba52),
	new Uint64BE(0x65d34954, 0xdaf3cebd),
	new Uint64BE(0xb4b81b3f, 0xa97511e2),
	new Uint64BE(0xb4220611, 0x93d6f6a7),
	new Uint64BE(0x07158240, 0x1c38434d),
	new Uint64BE(0x7a13f18b, 0xbedc4ff5),
	new Uint64BE(0xbc4097b1, 0x16c524d2),
	new Uint64BE(0x59b97885, 0xe2f2ea28),
	new Uint64BE(0x99170a5d, 0xc3115544),
	new Uint64BE(0x6f423357, 0xe7c6a9f9),
	new Uint64BE(0x325928ee, 0x6e6f8794),
	new Uint64BE(0xd0e43662, 0x28b03343),
	new Uint64BE(0x565c31f7, 0xde89ea27),
	new Uint64BE(0x30f56114, 0x84119414),
	new Uint64BE(0xd873db39, 0x1292ed4f),
	new Uint64BE(0x7bd94e1d, 0x8e17debc),
	new Uint64BE(0xc7d9f168, 0x64a76e94),
	new Uint64BE(0x947ae053, 0xee56e63c),
	new Uint64BE(0xc8c93882, 0xf9475f5f),
	new Uint64BE(0x3a9bf55b, 0xa91f81ca),
	new Uint64BE(0xd9a11fbb, 0x3d9808e4),
	new Uint64BE(0x0fd22063, 0xedc29fca),
	new Uint64BE(0xb3f256d8, 0xaca0b0b9),
	new Uint64BE(0xb03031a8, 0xb4516e84),
	new Uint64BE(0x35dd37d5, 0x871448af),
	new Uint64BE(0xe9f6082b, 0x05542e4e),
	new Uint64BE(0xebfafa33, 0xd7254b59),
	new Uint64BE(0x9255abb5, 0x0d532280),
	new Uint64BE(0xb9ab4ce5, 0x7f2d34f3),
	new Uint64BE(0x693501d6, 0x28297551),
	new Uint64BE(0xc62c58f9, 0x7dd949bf),
	new Uint64BE(0xcd454f8f, 0x19c5126a),
	new Uint64BE(0xbbe83f4e, 0xcc2bdecb),
	new Uint64BE(0xdc842b7e, 0x2819e230),
	new Uint64BE(0xba89142e, 0x007503b8),
	new Uint64BE(0xa3bc941d, 0x0a5061cb),
	new Uint64BE(0xe9f6760e, 0x32cd8021),
	new Uint64BE(0x09c7e552, 0xbc76492f),
	new Uint64BE(0x852f5493, 0x4da55cc9),
	new Uint64BE(0x8107fccf, 0x064fcf56),
	new Uint64BE(0x098954d5, 0x1fff6580),
	new Uint64BE(0x23b70edb, 0x1955c4bf),
	new Uint64BE(0xc330de42, 0x6430f69d),
	new Uint64BE(0x4715ed43, 0xe8a45c0a),
	new Uint64BE(0xa8d7e4da, 0xb780a08d),
	new Uint64BE(0x0572b974, 0xf03ce0bb),
	new Uint64BE(0xb57d2e98, 0x5e1419c7),
	new Uint64BE(0xe8d9ecbe, 0x2cf3d73f),
	new Uint64BE(0x2fe4b171, 0x70e59750),
	new Uint64BE(0x11317ba8, 0x7905e790),
	new Uint64BE(0x7fbf21ec, 0x8a1f45ec),
	new Uint64BE(0x1725cabf, 0xcb045b00),
	new Uint64BE(0x964e915c, 0xd5e2b207),
	new Uint64BE(0x3e2b8bcb, 0xf016d66d),
	new Uint64BE(0xbe7444e3, 0x9328a0ac),
	new Uint64BE(0xf85b2b4f, 0xbcde44b7),
	new Uint64BE(0x49353fea, 0x39ba63b1),
	new Uint64BE(0x1dd01aaf, 0xcd53486a),
	new Uint64BE(0x1fca8a92, 0xfd719f85),
	new Uint64BE(0xfc7c95d8, 0x27357afa),
	new Uint64BE(0x18a6a990, 0xc8b35ebd),
	new Uint64BE(0xcccb7005, 0xc6b9c28d),
	new Uint64BE(0x3bdbb92c, 0x43b17f26),
	new Uint64BE(0xaa70b5b4, 0xf89695a2),
	new Uint64BE(0xe94c39a5, 0x4a98307f),
	new Uint64BE(0xb7a0b174, 0xcff6f36e),
	new Uint64BE(0xd4dba847, 0x29af48ad),
	new Uint64BE(0x2e18bc1a, 0xd9704a68),
	new Uint64BE(0x2de0966d, 0xaf2f8b1c),
	new Uint64BE(0xb9c11d5b, 0x1e43a07e),
	new Uint64BE(0x64972d68, 0xdee33360),
	new Uint64BE(0x94628d38, 0xd0c20584),
	new Uint64BE(0xdbc0d2b6, 0xab90a559),
	new Uint64BE(0xd2733c43, 0x35c6a72f),
	new Uint64BE(0x7e75d99d, 0x94a70f4d),
	new Uint64BE(0x6ced1983, 0x376fa72b),
	new Uint64BE(0x97fcaacb, 0xf030bc24),
	new Uint64BE(0x7b77497b, 0x32503b12),
	new Uint64BE(0x8547eddf, 0xb81ccb94),
	new Uint64BE(0x79999cdf, 0xf70902cb),
	new Uint64BE(0xcffe1939, 0x438e9b24),
	new Uint64BE(0x829626e3, 0x892d95d7),
	new Uint64BE(0x92fae242, 0x91f2b3f1),
	new Uint64BE(0x63e22c14, 0x7b9c3403),
	new Uint64BE(0xc678b6d8, 0x60284a1c),
	new Uint64BE(0x58738888, 0x50659ae7),
	new Uint64BE(0x0981dcd2, 0x96a8736d),
	new Uint64BE(0x9f65789a, 0x6509a440),
	new Uint64BE(0x9ff38fed, 0x72e9052f),
	new Uint64BE(0xe479ee5b, 0x9930578c),
	new Uint64BE(0xe7f28ecd, 0x2d49eecd),
	new Uint64BE(0x56c074a5, 0x81ea17fe),
	new Uint64BE(0x5544f7d7, 0x74b14aef),
	new Uint64BE(0x7b3f0195, 0xfc6f290f),
	new Uint64BE(0x12153635, 0xb2c0cf57),
	new Uint64BE(0x7f5126db, 0xba5e0ca7),
	new Uint64BE(0x7a76956c, 0x3eafb413),
	new Uint64BE(0x3d5774a1, 0x1d31ab39),
	new Uint64BE(0x8a1b0838, 0x21f40cb4),
	new Uint64BE(0x7b4a38e3, 0x2537df62),
	new Uint64BE(0x95011364, 0x6d1d6e03),
	new Uint64BE(0x4da8979a, 0x0041e8a9),
	new Uint64BE(0x3bc36e07, 0x8f7515d7),
	new Uint64BE(0x5d0a12f2, 0x7ad310d1),
	new Uint64BE(0x7f9d1a2e, 0x1ebe1327),
	new Uint64BE(0xda3a361b, 0x1c5157b1),
	new Uint64BE(0xdcdd7d20, 0x903d0c25),
	new Uint64BE(0x36833336, 0xd068f707),
	new Uint64BE(0xce68341f, 0x79893389),
	new Uint64BE(0xab909016, 0x8dd05f34),
	new Uint64BE(0x43954b32, 0x52dc25e5),
	new Uint64BE(0xb438c2b6, 0x7f98e5e9),
	new Uint64BE(0x10dcd78e, 0x3851a492),
	new Uint64BE(0xdbc27ab5, 0x447822bf),
	new Uint64BE(0x9b3cdb65, 0xf82ca382),
	new Uint64BE(0xb67b7896, 0x167b4c84),
	new Uint64BE(0xbfced1b0, 0x048eac50),
	new Uint64BE(0xa9119b60, 0x369ffebd),
	new Uint64BE(0x1fff7ac8, 0x0904bf45),
	new Uint64BE(0xac12fb17, 0x1817eee7),
	new Uint64BE(0xaf08da91, 0x77dda93d),
	new Uint64BE(0x1b0cab93, 0x6e65c744),
	new Uint64BE(0xb559eb1d, 0x04e5e932),
	new Uint64BE(0xc37b45b3, 0xf8d6f2ba),
	new Uint64BE(0xc3a9dc22, 0x8caac9e9),
	new Uint64BE(0xf3b8b667, 0x5a6507ff),
	new Uint64BE(0x9fc477de, 0x4ed681da),
	new Uint64BE(0x67378d8e, 0xccef96cb),
	new Uint64BE(0x6dd856d9, 0x4d259236),
	new Uint64BE(0xa319ce15, 0xb0b4db31),
	new Uint64BE(0x07397375, 0x1f12dd5e),
	new Uint64BE(0x8a8e849e, 0xb32781a5),
	new Uint64BE(0xe1925c71, 0x285279f5),
	new Uint64BE(0x74c04bf1, 0x790c0efe),
	new Uint64BE(0x4dda4815, 0x3c94938a),
	new Uint64BE(0x9d266d6a, 0x1cc0542c),
	new Uint64BE(0x7440fb81, 0x6508c4fe),
	new Uint64BE(0x13328503, 0xdf48229f),
	new Uint64BE(0xd6bf7bae, 0xe43cac40),
	new Uint64BE(0x4838d65f, 0x6ef6748f),
	new Uint64BE(0x1e152328, 0xf3318dea),
	new Uint64BE(0x8f8419a3, 0x48f296bf),
	new Uint64BE(0x72c8834a, 0x5957b511),
	new Uint64BE(0xd7a023a7, 0x3260b45c),
	new Uint64BE(0x94ebc8ab, 0xcfb56dae),
	new Uint64BE(0x9fc10d0f, 0x989993e0),
	new Uint64BE(0xde68a235, 0x5b93cae6),
	new Uint64BE(0xa44cfe79, 0xae538bbe),
	new Uint64BE(0x9d1d84fc, 0xce371425),
	new Uint64BE(0x51d2b1ab, 0x2ddfb636),
	new Uint64BE(0x2fd7e4b9, 0xe72cd38c),
	new Uint64BE(0x65ca5b96, 0xb7552210),
	new Uint64BE(0xdd69a0d8, 0xab3b546d),
	new Uint64BE(0x604d51b2, 0x5fbf70e2),
	new Uint64BE(0x73aa8a56, 0x4fb7ac9e),
	new Uint64BE(0x1a8c1e99, 0x2b941148),
	new Uint64BE(0xaac40a27, 0x03d9bea0),
	new Uint64BE(0x764dbeae, 0x7fa4f3a6),
	new Uint64BE(0x1e99b96e, 0x70a9be8b),
	new Uint64BE(0x2c5e9deb, 0x57ef4743),
	new Uint64BE(0x3a938fee, 0x32d29981),
	new Uint64BE(0x26e6db8f, 0xfdf5adfe),
	new Uint64BE(0x469356c5, 0x04ec9f9d),
	new Uint64BE(0xc8763c5b, 0x08d1908c),
	new Uint64BE(0x3f6c6af8, 0x59d80055),
	new Uint64BE(0x7f7cc394, 0x20a3a545),
	new Uint64BE(0x9bfb227e, 0xbdf4c5ce),
	new Uint64BE(0x89039d79, 0xd6fc5c5c),
	new Uint64BE(0x8fe88b57, 0x305e2ab6),
	new Uint64BE(0xa09e8c8c, 0x35ab96de),
	new Uint64BE(0xfa7e3939, 0x83325753),
	new Uint64BE(0xd6b6d0ec, 0xc617c699),
	new Uint64BE(0xdfea21ea, 0x9e7557e3),
	new Uint64BE(0xb67c1fa4, 0x81680af8),
	new Uint64BE(0xca1e3785, 0xa9e724e5),
	new Uint64BE(0x1cfc8bed, 0x0d681639),
	new Uint64BE(0xd18d8549, 0xd140caea),
	new Uint64BE(0x4ed0fe7e, 0x9dc91335),
	new Uint64BE(0xe4dbf063, 0x4473f5d2),
	new Uint64BE(0x1761f93a, 0x44d5aefe),
	new Uint64BE(0x53898e4c, 0x3910da55),
	new Uint64BE(0x734de818, 0x1f6ec39a),
	new Uint64BE(0x2680b122, 0xbaa28d97),
	new Uint64BE(0x298af231, 0xc85bafab),
	new Uint64BE(0x7983eed3, 0x740847d5),
	new Uint64BE(0x66c1a2a1, 0xa60cd889),
	new Uint64BE(0x9e17e496, 0x42a3e4c1),
	new Uint64BE(0xedb454e7, 0xbadc0805),
	new Uint64BE(0x50b704ca, 0xb602c329),
	new Uint64BE(0x4cc317fb, 0x9cddd023),
	new Uint64BE(0x66b4835d, 0x9eafea22),
	new Uint64BE(0x219b97e2, 0x6ffc81bd),
	new Uint64BE(0x261e4e4c, 0x0a333a9d),
	new Uint64BE(0x1fe2cca7, 0x6517db90),
	new Uint64BE(0xd7504dfa, 0x8816edbb),
	new Uint64BE(0xb9571fa0, 0x4dc089c8),
	new Uint64BE(0x1ddc0325, 0x259b27de),
	new Uint64BE(0xcf3f4688, 0x801eb9aa),
	new Uint64BE(0xf4f5d05c, 0x10cab243),
	new Uint64BE(0x38b6525c, 0x21a42b0e),
	new Uint64BE(0x36f60e2b, 0xa4fa6800),
	new Uint64BE(0xeb359380, 0x3173e0ce),
	new Uint64BE(0x9c4cd625, 0x7c5a3603),
	new Uint64BE(0xaf0c317d, 0x32adaa8a),
	new Uint64BE(0x258e5a80, 0xc7204c4b),
	new Uint64BE(0x8b889d62, 0x4d44885d),
	new Uint64BE(0xf4d14597, 0xe660f855),
	new Uint64BE(0xd4347f66, 0xec8941c3),
	new Uint64BE(0xe699ed85, 0xb0dfb40d),
	new Uint64BE(0x2472f620, 0x7c2d0484),
	new Uint64BE(0xc2a1e7b5, 0xb459aeb5),
	new Uint64BE(0xab4f6451, 0xcc1d45ec),
	new Uint64BE(0x63767572, 0xae3d6174),
	new Uint64BE(0xa59e0bd1, 0x01731a28),
	new Uint64BE(0x116d0016, 0xcb948f09),
	new Uint64BE(0x2cf9c8ca, 0x052f6e9f),
	new Uint64BE(0x0b090a75, 0x60a968e3),
	new Uint64BE(0xabeeddb2, 0xdde06ff1),
	new Uint64BE(0x58efc10b, 0x06a2068d),
	new Uint64BE(0xc6e57a78, 0xfbd986e0),
	new Uint64BE(0x2eab8ca6, 0x3ce802d7),
	new Uint64BE(0x14a19564, 0x0116f336),
	new Uint64BE(0x7c0828dd, 0x624ec390),
	new Uint64BE(0xd74bbe77, 0xe6116ac7),
	new Uint64BE(0x804456af, 0x10f5fb53),
	new Uint64BE(0xebe9ea2a, 0xdf4321c7),
	new Uint64BE(0x03219a39, 0xee587a30),
	new Uint64BE(0x49787fef, 0x17af9924),
	new Uint64BE(0xa1e9300c, 0xd8520548),
	new Uint64BE(0x5b45e522, 0xe4b1b4ef),
	new Uint64BE(0xb49c3b39, 0x95091a36),
	new Uint64BE(0xd4490ad5, 0x26f14431),
	new Uint64BE(0x12a8f216, 0xaf9418c2),
	new Uint64BE(0x001f837c, 0xc7350524),
	new Uint64BE(0x1877b51e, 0x57a764d5),
	new Uint64BE(0xa2853b80, 0xf17f58ee),
	new Uint64BE(0x993e1de7, 0x2d36d310),
	new Uint64BE(0xb3598080, 0xce64a656),
	new Uint64BE(0x252f59cf, 0x0d9f04bb),
	new Uint64BE(0xd23c8e17, 0x6d113600),
	new Uint64BE(0x1bda0492, 0xe7e4586e),
	new Uint64BE(0x21e0bd50, 0x26c619bf),
	new Uint64BE(0x3b097ada, 0xf088f94e),
	new Uint64BE(0x8d14dedb, 0x30be846e),
	new Uint64BE(0xf95cffa2, 0x3af5f6f4),
	new Uint64BE(0x38717007, 0x61b3f743),
	new Uint64BE(0xca672b91, 0xe9e4fa16),
	new Uint64BE(0x64c8e531, 0xbff53b55),
	new Uint64BE(0x241260ed, 0x4ad1e87d),
	new Uint64BE(0x106c09b9, 0x72d2e822),
	new Uint64BE(0x7fba1954, 0x10e5ca30),
	new Uint64BE(0x7884d9bc, 0x6cb569d8),
	new Uint64BE(0x0647dfed, 0xcd894a29),
	new Uint64BE(0x63573ff0, 0x3e224774),
	new Uint64BE(0x4fc8e956, 0x0f91b123),
	new Uint64BE(0x1db956e4, 0x50275779),
	new Uint64BE(0xb8d91274, 0xb9e9d4fb),
	new Uint64BE(0xa2ebee47, 0xe2fbfce1),
	new Uint64BE(0xd9f1f30c, 0xcd97fb09),
	new Uint64BE(0xefed53d7, 0x5fd64e6b),
	new Uint64BE(0x2e6d02c3, 0x6017f67f),
	new Uint64BE(0xa9aa4d20, 0xdb084e9b),
	new Uint64BE(0xb64be8d8, 0xb25396c1),
	new Uint64BE(0x70cb6af7, 0xc2d5bcf0),
	new Uint64BE(0x98f076a4, 0xf7a2322e),
	new Uint64BE(0xbf844708, 0x05e69b5f),
	new Uint64BE(0x94c3251f, 0x06f90cf3),
	new Uint64BE(0x3e003e61, 0x6a6591e9),
	new Uint64BE(0xb925a6cd, 0x0421aff3),
	new Uint64BE(0x61bdd130, 0x7c66e300),
	new Uint64BE(0xbf8d5108, 0xe27e0d48),
	new Uint64BE(0x240ab57a, 0x8b888b20),
	new Uint64BE(0xfc87614b, 0xaf287e07),
	new Uint64BE(0xef02cdd0, 0x6ffdb432),
	new Uint64BE(0xa1082c04, 0x66df6c0a),
	new Uint64BE(0x8215e577, 0x001332c8),
	new Uint64BE(0xd39bb9c3, 0xa48db6cf),
	new Uint64BE(0x27382596, 0x34305c14),
	new Uint64BE(0x61cf4f94, 0xc97df93d),
	new Uint64BE(0x1b6baca2, 0xae4e125b),
	new Uint64BE(0x758f450c, 0x88572e0b),
	new Uint64BE(0x959f587d, 0x507a8359),
	new Uint64BE(0xb063e962, 0xe045f54d),
	new Uint64BE(0x60e8ed72, 0xc0dff5d1),
	new Uint64BE(0x7b649785, 0x55326f9f),
	new Uint64BE(0xfd080d23, 0x6da814ba),
	new Uint64BE(0x8c90fd9b, 0x083f4558),
	new Uint64BE(0x106f72fe, 0x81e2c590),
	new Uint64BE(0x7976033a, 0x39f7d952),
	new Uint64BE(0xa4ec0132, 0x764ca04b),
	new Uint64BE(0x733ea705, 0xfae4fa77),
	new Uint64BE(0xb4d8f77b, 0xc3e56167),
	new Uint64BE(0x9e21f4f9, 0x03b33fd9),
	new Uint64BE(0x9d765e41, 0x9fb69f6d),
	new Uint64BE(0xd30c088b, 0xa61ea5ef),
	new Uint64BE(0x5d94337f, 0xbfaf7f5b),
	new Uint64BE(0x1a4e4822, 0xeb4d7a59),
	new Uint64BE(0x6ffe73e8, 0x1b637fb3),
	new Uint64BE(0xddf957bc, 0x36d8b9ca),
	new Uint64BE(0x64d0e29e, 0xea8838b3),
	new Uint64BE(0x08dd9bdf, 0xd96b9f63),
	new Uint64BE(0x087e79e5, 0xa57d1d13),
	new Uint64BE(0xe328e230, 0xe3e2b3fb),
	new Uint64BE(0x1c2559e3, 0x0f0946be),
	new Uint64BE(0x720bf5f2, 0x6f4d2eaa),
	new Uint64BE(0xb0774d26, 0x1cc609db),
	new Uint64BE(0x443f64ec, 0x5a371195),
	new Uint64BE(0x4112cf68, 0x649a260e),
	new Uint64BE(0xd813f2fa, 0xb7f5c5ca),
	new Uint64BE(0x660d3257, 0x380841ee),
	new Uint64BE(0x59ac2c78, 0x73f910a3),
	new Uint64BE(0xe8469638, 0x77671a17),
	new Uint64BE(0x93b633ab, 0xfa3469f8),
	new Uint64BE(0xc0c0f5a6, 0x0ef4cdcf),
	new Uint64BE(0xcaf21ecd, 0x4377b28c),
	new Uint64BE(0x57277707, 0x199b8175),
	new Uint64BE(0x506c11b9, 0xd90e8b1d),
	new Uint64BE(0xd83cc268, 0x7a19255f),
	new Uint64BE(0x4a29c646, 0x5a314cd1),
	new Uint64BE(0xed2df212, 0x16235097),
	new Uint64BE(0xb5635c95, 0xff7296e2),
	new Uint64BE(0x22af003a, 0xb672e811),
	new Uint64BE(0x52e76259, 0x6bf68235),
	new Uint64BE(0x9aeba33a, 0xc6ecc6b0),
	new Uint64BE(0x944f6de0, 0x9134dfb6),
	new Uint64BE(0x6c47bec8, 0x83a7de39),
	new Uint64BE(0x6ad047c4, 0x30a12104),
	new Uint64BE(0xa5b1cfdb, 0xa0ab4067),
	new Uint64BE(0x7c45d833, 0xaff07862),
	new Uint64BE(0x5092ef95, 0x0a16da0b),
	new Uint64BE(0x9338e69c, 0x052b8e7b),
	new Uint64BE(0x455a4b4c, 0xfe30e3f5),
	new Uint64BE(0x6b02e631, 0x95ad0cf8),
	new Uint64BE(0x6b17b224, 0xbad6bf27),
	new Uint64BE(0xd1e0ccd2, 0x5bb9c169),
	new Uint64BE(0xde0c89a5, 0x56b9ae70),
	new Uint64BE(0x50065e53, 0x5a213cf6),
	new Uint64BE(0x9c1169fa, 0x2777b874),
	new Uint64BE(0x78edefd6, 0x94af1eed),
	new Uint64BE(0x6dc93d95, 0x26a50e68),
	new Uint64BE(0xee97f453, 0xf06791ed),
	new Uint64BE(0x32ab0edb, 0x696703d3),
	new Uint64BE(0x3a6853c7, 0xe70757a7),
	new Uint64BE(0x31865ced, 0x6120f37d),
	new Uint64BE(0x67fef95d, 0x92607890),
	new Uint64BE(0x1f2b1d1f, 0x15f6dc9c),
	new Uint64BE(0xb69e38a8, 0x965c6b65),
	new Uint64BE(0xaa9119ff, 0x184cccf4),
	new Uint64BE(0xf43c7328, 0x73f24c13),
	new Uint64BE(0xfb4a3d79, 0x4a9a80d2),
	new Uint64BE(0x3550c232, 0x1fd6109c),
	new Uint64BE(0x371f77e7, 0x6bb8417e),
	new Uint64BE(0x6bfa9aae, 0x5ec05779),
	new Uint64BE(0xcd04f3ff, 0x001a4778),
	new Uint64BE(0xe3273522, 0x064480ca),
	new Uint64BE(0x9f91508b, 0xffcfc14a),
	new Uint64BE(0x049a7f41, 0x061a9e60),
	new Uint64BE(0xfcb6be43, 0xa9f2fe9b),
	new Uint64BE(0x08de8a1c, 0x7797da9b),
	new Uint64BE(0x8f9887e6, 0x078735a1),
	new Uint64BE(0xb5b4071d, 0xbfc73a66),
	new Uint64BE(0x230e343d, 0xfba08d33),
	new Uint64BE(0x43ed7f5a, 0x0fae657d),
	new Uint64BE(0x3a88a0fb, 0xbcb05c63),
	new Uint64BE(0x21874b8b, 0x4d2dbc4f),
	new Uint64BE(0x1bdea12e, 0x35f6a8c9),
	new Uint64BE(0x53c065c6, 0xc8e63528),
	new Uint64BE(0xe34a1d25, 0x0e7a8d6b),
	new Uint64BE(0xd6b04d3b, 0x7651dd7e),
	new Uint64BE(0x5e90277e, 0x7cb39e2d),
	new Uint64BE(0x2c046f22, 0x062dc67d),
	new Uint64BE(0xb10bb459, 0x132d0a26),
	new Uint64BE(0x3fa9ddfb, 0x67e2f199),
	new Uint64BE(0x0e09b88e, 0x1914f7af),
	new Uint64BE(0x10e8b35a, 0xf3eeab37),
	new Uint64BE(0x9eedeca8, 0xe272b933),
	new Uint64BE(0xd4c718bc, 0x4ae8ae5f),
	new Uint64BE(0x81536d60, 0x1170fc20),
	new Uint64BE(0x91b534f8, 0x85818a06),
	new Uint64BE(0xec8177f8, 0x3f900978),
	new Uint64BE(0x190e714f, 0xada5156e),
	new Uint64BE(0xb592bf39, 0xb0364963),
	new Uint64BE(0x89c350c8, 0x93ae7dc1),
	new Uint64BE(0xac042e70, 0xf8b383f2),
	new Uint64BE(0xb49b52e5, 0x87a1ee60),
	new Uint64BE(0xfb152fe3, 0xff26da89),
	new Uint64BE(0x3e666e6f, 0x69ae2c15),
	new Uint64BE(0x3b544ebe, 0x544c19f9),
	new Uint64BE(0xe805a1e2, 0x90cf2456),
	new Uint64BE(0x24b33c9d, 0x7ed25117),
	new Uint64BE(0xe7473342, 0x7b72f0c1),
	new Uint64BE(0x0a804d18, 0xb7097475),
	new Uint64BE(0x57e3306d, 0x881edb4f),
	new Uint64BE(0x4ae7d6a3, 0x6eb5dbcb),
	new Uint64BE(0x2d8d5432, 0x157064c8),
	new Uint64BE(0xd1e649de, 0x1e7f268b),
	new Uint64BE(0x8a328a1c, 0xedfe552c),
	new Uint64BE(0x07a3aec7, 0x9624c7da),
	new Uint64BE(0x84547ddc, 0x3e203c94),
	new Uint64BE(0x990a98fd, 0x5071d263),
	new Uint64BE(0x1a4ff126, 0x16eefc89),
	new Uint64BE(0xf6f7fd14, 0x31714200),
	new Uint64BE(0x30c05b1b, 0xa332f41c),
	new Uint64BE(0x8d2636b8, 0x1555a786),
	new Uint64BE(0x46c9feb5, 0x5d120902),
	new Uint64BE(0xccec0a73, 0xb49c9921),
	new Uint64BE(0x4e9d2827, 0x355fc492),
	new Uint64BE(0x19ebb029, 0x435dcb0f),
	new Uint64BE(0x4659d2b7, 0x43848a2c),
	new Uint64BE(0x963ef2c9, 0x6b33be31),
	new Uint64BE(0x74f85198, 0xb05a2e7d),
	new Uint64BE(0x5a0f544d, 0xd2b1fb18),
	new Uint64BE(0x03727073, 0xc2e134b1),
	new Uint64BE(0xc7f6aa2d, 0xe59aea61),
	new Uint64BE(0x352787ba, 0xa0d7c22f),
	new Uint64BE(0x9853eab6, 0x3b5e0b35),
	new Uint64BE(0xabbdcdd7, 0xed5c0860),
	new Uint64BE(0xcf05daf5, 0xac8d77b0),
	new Uint64BE(0x49cad48c, 0xebf4a71e),
	new Uint64BE(0x7a4c10ec, 0x2158c4a6),
	new Uint64BE(0xd9e92aa2, 0x46bf719e),
	new Uint64BE(0x13ae978d, 0x09fe5557),
	new Uint64BE(0x730499af, 0x921549ff),
	new Uint64BE(0x4e4b705b, 0x92903ba4),
	new Uint64BE(0xff577222, 0xc14f0a3a),
	new Uint64BE(0x55b6344c, 0xf97aafae),
	new Uint64BE(0xb862225b, 0x055b6960),
	new Uint64BE(0xcac09afb, 0xddd2cdb4),
	new Uint64BE(0xdaf8e982, 0x9fe96b5f),
	new Uint64BE(0xb5fdfc5d, 0x3132c498),
	new Uint64BE(0x310cb380, 0xdb6f7503),
	new Uint64BE(0xe87fbb46, 0x217a360e),
	new Uint64BE(0x2102ae46, 0x6ebb1148),
	new Uint64BE(0xf8549e1a, 0x3aa5e00d),
	new Uint64BE(0x07a69afd, 0xcc42261a),
	new Uint64BE(0xc4c118bf, 0xe78feaae),
	new Uint64BE(0xf9f4892e, 0xd96bd438),
	new Uint64BE(0x1af3dbe2, 0x5d8f45da),
	new Uint64BE(0xf5b4b0b0, 0xd2deeeb4),
	new Uint64BE(0x962aceef, 0xa82e1c84),
	new Uint64BE(0x046e3eca, 0xaf453ce9),
	new Uint64BE(0xf05d1296, 0x81949a4c),
	new Uint64BE(0x964781ce, 0x734b3c84),
	new Uint64BE(0x9c2ed440, 0x81ce5fbd),
	new Uint64BE(0x522e23f3, 0x925e319e),
	new Uint64BE(0x177e00f9, 0xfc32f791),
	new Uint64BE(0x2bc60a63, 0xa6f3b3f2),
	new Uint64BE(0x222bbfae, 0x61725606),
	new Uint64BE(0x486289dd, 0xcc3d6780),
	new Uint64BE(0x7dc7785b, 0x8efdfc80),
	new Uint64BE(0x8af38731, 0xc02ba980),
	new Uint64BE(0x1fab64ea, 0x29a2ddf7),
	new Uint64BE(0xe4d94293, 0x22cd065a),
	new Uint64BE(0x9da058c6, 0x7844f20c),
	new Uint64BE(0x24c0e332, 0xb70019b0),
	new Uint64BE(0x233003b5, 0xa6cfe6ad),
	new Uint64BE(0xd586bd01, 0xc5c217f6),
	new Uint64BE(0x5e563788, 0x5f29bc2b),
	new Uint64BE(0x7eba726d, 0x8c94094b),
	new Uint64BE(0x0a56a5f0, 0xbfe39272),
	new Uint64BE(0xd79476a8, 0x4ee20d06),
	new Uint64BE(0x9e4c1269, 0xbaa4bf37),
	new Uint64BE(0x17efee45, 0xb0dee640),
	new Uint64BE(0x1d95b0a5, 0xfcf90bc6),
	new Uint64BE(0x93cbe0b6, 0x99c2585d),
	new Uint64BE(0x65fa4f22, 0x7a2b6d79),
	new Uint64BE(0xd5f9e858, 0x292504d5),
	new Uint64BE(0xc2b5a03f, 0x71471a6f),
	new Uint64BE(0x59300222, 0xb4561e00),
	new Uint64BE(0xce2f8642, 0xca0712dc),
	new Uint64BE(0x7ca9723f, 0xbb2e8988),
	new Uint64BE(0x27853383, 0x47f2ba08),
	new Uint64BE(0xc61bb3a1, 0x41e50e8c),
	new Uint64BE(0x150f361d, 0xab9dec26),
	new Uint64BE(0x9f6a419d, 0x382595f4),
	new Uint64BE(0x64a53dc9, 0x24fe7ac9),
	new Uint64BE(0x142de49f, 0xff7a7c3d),
	new Uint64BE(0x0c335248, 0x857fa9e7),
	new Uint64BE(0x0a9c32d5, 0xeae45305),
	new Uint64BE(0xe6c42178, 0xc4bbb92e),
	new Uint64BE(0x71f1ce24, 0x90d20b07),
	new Uint64BE(0xf1bcc3d2, 0x75afe51a),
	new Uint64BE(0xe728e8c8, 0x3c334074),
	new Uint64BE(0x96fbf83a, 0x12884624),
	new Uint64BE(0x81a1549f, 0xd6573da5),
	new Uint64BE(0x5fa7867c, 0xaf35e149),
	new Uint64BE(0x56986e2e, 0xf3ed091b),
	new Uint64BE(0x917f1dd5, 0xf8886c61),
	new Uint64BE(0xd20d8c88, 0xc8ffe65f),
	new Uint64BE(0x31d71dce, 0x64b2c310),
	new Uint64BE(0xf165b587, 0xdf898190),
	new Uint64BE(0xa57e6339, 0xdd2cf3a0),
	new Uint64BE(0x1ef6e6db, 0xb1961ec9),
	new Uint64BE(0x70cc73d9, 0x0bc26e24),
	new Uint64BE(0xe21a6b35, 0xdf0c3ad7),
	new Uint64BE(0x003a93d8, 0xb2806962),
	new Uint64BE(0x1c99ded3, 0x3cb890a1),
	new Uint64BE(0xcf3145de, 0x0add4289),
	new Uint64BE(0xd0e4427a, 0x5514fb72),
	new Uint64BE(0x77c621cc, 0x9fb3a483),
	new Uint64BE(0x67a34dac, 0x4356550b),
	new Uint64BE(0xf8d626aa, 0xaf278509),
];

const randomPiece = random64.slice(0, 768);
const randomCastling = random64.slice(768, 768 + 4);
const randomEnPassant = random64.slice(764, 764 + 4);
const randomWhite = random64.slice(780, 780 + 1);

/**
 * The `Polyglot` class represents an opening book in Polyglot (.bin) format.
 */
export class Polyglot implements Book {
	private fh?: fs.FileHandle;
	private filename: string;
	private numEntries?: number;

	/**
	 * Creates the object. Calling init() afterwards is mandatory!
	 *
	 * @param filenameOrFileHandle either a filename or a file handle
	 * @param filename an optional filename if passing a file handle
	 */
	constructor(filenameOrFileHandle: string | fs.FileHandle, filename?: string) {
		if (typeof filenameOrFileHandle === 'string') {
			this.filename = filenameOrFileHandle;
		} else {
			this.fh = filenameOrFileHandle;
			this.filename = filename ?? '[file handle]';
		}
	}

	async open() {
		if (typeof this.numEntries !== 'undefined') {
			throw new Error('Object is already initialised!');
		}

		if (!this.fh) {
			this.fh = await fs.open(this.filename, 'r');
		}

		const stat = await this.fh.stat();
		const size = stat.size;
		if (size & 0xf) {
			throw new Error('File size is not a multiple of 16!');
		}

		this.numEntries = size >> 4;
	}

	private fen2epd(fen: string) {
		const tokens = fen.split(/[ \t]+/);

		while (tokens.length > 4) {
			tokens.pop();
		}

		return tokens.join(' ');
	}

	public async lookup(fen: string) {
		const epd = this.fen2epd(fen);
		const range = await this.findKey(epd);
		if (typeof range === 'undefined') return;

		const entry = new Entry(epd);
		for (let i = range[0]; i <= range[1]; ++i) {
			entry.addMove(await this.getEntry(i));
		}

		return entry;
	}

	public async close(): Promise<void> {
		if (this.fh) {
			await this.fh.close();
			this.fh = undefined;
		}
	}

	// Do a binary search in the file for the requested position.
	// Using variations of the binary search like interpolation search or the
	// newer adaptive search or hybrid search
	// (https://arxiv.org/ftp/arxiv/papers/1708/1708.00964.pdf) is less performant
	// because it involves significantly more disk access.
	// This method returns a range of matching records.
	protected async findKey(fen: string): Promise<[number, number] | undefined> {
		if (typeof this.numEntries === 'undefined') {
			throw new Error('Object is not initialised!');
		}

		const key = this.getKey(fen);
		if (!key) {
			return;
		}

		// First find the lower bound. Whenever possible, we also reduce the
		// search space for the upper bound.
		let left = 0;
		let right = this.numEntries;
		let right2 = right;

		let mid: number = 0;
		let found: Uint64BE;
		while (left < right) {
			mid = (left + right) >> 1;
			const key_at = await this.getEntryKey(mid);
			const cmp = this.cmp64(key_at, key);
			if (cmp < 0) {
				left = mid + 1;
			} else if (cmp > 0) {
				right = mid - 1;
				right2 = mid;
			} else {
				found = key_at;
				right = mid;
			}
		}

		if (left >= this.numEntries) return;
		if (typeof found! === 'undefined') {
			const key_at = await this.getEntryKey(left);
			if (this.cmp64(key_at, key)) return;
		}
		if (right > left) return;

		const lower = left;
		right = right2 - 1;

		while (left <= right) {
			mid = (left + right) >> 1;
			const key_at = await this.getEntryKey(mid);
			const cmp = this.cmp64(key_at, key);

			if (cmp > 0) {
				right = mid - 1;
			} else if (cmp < 0) {
				if (left === mid) return;
				left = mid;
			} else {
				left = mid + 1;
			}
		}

		const upper = right;

		return [lower, upper];
	}

	protected getKey(fen: string): Uint64BE | undefined {
		let key = new Uint64BE(0, 0);

		const pos = parseFEN(fen);
		if (!pos) {
			throw new Error(`invalid fen: ${fen}`);
		}

		const pieces = pieceMapping();

		pos.pieces.forEach(spec => {
			const fileChar = spec.square[0];
			const rankChar = spec.square[1];

			const file = fileChar.charCodeAt(0) - 'a'.charCodeAt(0);
			const rank = rankChar.charCodeAt(0) - '1'.charCodeAt(0);
			const piece = pieces[spec.piece];
			const offset = (piece << 6) | (rank << 3) | file;
			key = this.xor64(key, randomPiece[offset]);
		});

		const castlingOffsets = {
			K: 0,
			Q: 1,
			k: 2,
			q: 3,
		};

		for (let i = 0; i < pos.castling.length; ++i) {
			const offset = castlingOffsets[pos.castling[i] as 'K' | 'Q' | 'k' | 'q'];
			key = this.xor64(key, randomCastling[offset]);
		}

		if (pos.epSquare) {
			const epFile = pos.epSquare[0];
			const epCharCode = epFile.charCodeAt(0) - 'a'.charCodeAt(0);

			// This may produce invalid coordinates for the a and h rank but this
			// is harmless.
			const pawns: EPSquare[] = [];
			let pawn: 'P' | 'p';

			if ('w' === pos.turn) {
				pawns.push((String.fromCharCode(epCharCode - 1) + '5') as EPSquare);
				pawns.push((String.fromCharCode(epCharCode + 1) + '5') as EPSquare);
				pawn = 'P';
			} else {
				pawns.push((String.fromCharCode(epCharCode - 1) + '3') as EPSquare);
				pawns.push((String.fromCharCode(epCharCode + 1) + '3') as EPSquare);
				pawn = 'p';
			}

			SPEC: for (const spec of pos.pieces) {
				for (const square of pawns) {
					if (spec.square === square && spec.piece === pawn) {
						key = this.xor64(key, randomEnPassant[epCharCode]);
						break SPEC;
					}
				}
			}
		}

		if ('w' === pos.turn) {
			key = this.xor64(key, randomWhite[0]);
		}

		return key;
	}

	private async getEntryKey(num: number): Promise<Uint64BE> {
		const position = num << 4;

		const key = Buffer.alloc(8);
		const { bytesRead } = await this.fh!.read(key, { length: 8, position });
		if (bytesRead == 0) {
			throw new Error(`unexpected end-of-file reading from '${this.filename}'`);
		}
		if (bytesRead < 8) {
			throw new Error(
				`unexpected end-of-file reading from '${this.filename}': expected 8 bytes, got ${bytesRead}`,
			);
		}

		return new Uint64BE(key);
	}

	private xor64(a: Uint64BE, b: Uint64BE): Uint64BE {
		const bufA = a.toBuffer();
		const bufB = b.toBuffer();

		const out = Buffer.alloc(8);
		for (let i = 0; i < 8; ++i) {
			out[i] = bufA[i] ^ bufB[i];
		}

		return new Uint64BE(out);
	}

	private cmp64(a: Uint64BE, b: Uint64BE): -1 | 0 | 1 {
		const bufA = a.toBuffer();
		const bufB = b.toBuffer();

		for (let i = 0; i < 8; ++i) {
			if (bufA[i] < bufB[i]) {
				return -1;
			} else if (bufA[i] > bufB[i]) {
				return 1;
			}
		}

		return 0;
	}

	protected async getEntry(
		num: number,
	): Promise<{ move: string; weight?: number; learn?: number }> {
		const offset = num << 4;
		const buf = Buffer.alloc(16);

		const { bytesRead } = await this.fh!.read(buf, 0, 16, offset);
		if (bytesRead <= 0) {
			throw new Error(
				`error reading from '${this.filename}': unexpected end-of-file`,
			);
		}
		if (bytesRead !== 16) {
			throw new Error(
				`unexpected end-of-file reading from '${this.filename}, wanted 16 bytes, got ${bytesRead}`,
			);
		}

		const moveBits = buf.readUInt16BE(8);
		const weight = buf.readUInt16BE(10);
		const learn = buf.readUInt32BE(12);

		const toFile = moveBits & 0x7;
		const toRank = (moveBits >> 3) & 0x7;
		const fromFile = (moveBits >> 6) & 0x7;
		const fromRank = (moveBits >> 9) & 0x7;
		const promote = (moveBits >> 12) & 0x7;
		const promotionPieces = ['', 'k', 'b', 'r', 'q'];

		const move =
			String.fromCharCode('a'.charCodeAt(0) + fromFile) +
			String.fromCharCode('1'.charCodeAt(0) + fromRank) +
			String.fromCharCode('a'.charCodeAt(0) + toFile) +
			String.fromCharCode('1'.charCodeAt(0) + toRank) +
			(promotionPieces[promote] ?? '');

		if (!/^[a-h][1-8][a-h][1-8][kbrq]?$/.test(move)) {
			throw new Error(`error: '${this.filename}' is corrupted`);
		}

		return { move, weight, learn };
	}
}
