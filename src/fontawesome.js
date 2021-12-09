import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChessRook, faChessBishop, faChessKnight, faChessKing, faChessQueen, faChessPawn, faRetweet,
  faUndo, faPlay, faStop, faChessBoard, faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight,
  faUserCircle, faUser, faEnvelope, faLock, faBackspace, faWaveSquare, faShoePrints, faFlag, 
  faPlayCircle, faStopCircle, faArrowUp, faArrowDown, faArrowRight, faArrowLeft, faStopwatch, 
  faLightbulb, faRobot, faEraser, faEyeSlash, faEye, faComments, faCheckCircle, 
  faKey, faInfoCircle, faSignOutAlt, faTrashAlt, faUserCog, faStarHalfAlt, faStar,
  faSmile, faMeh, faFrown, faGrinHearts, faAngry, faTimes, faArrowCircleLeft, faAppleAlt, faTh
} from "@fortawesome/free-solid-svg-icons";

library.add(
  // chess
  faChessRook, faChessBishop, faChessKnight, faChessKnight,
  faChessKing, faChessQueen, faChessPawn, faChessBoard,
  faRetweet, faUndo, faPlay, faStop,

  faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight,

  // user
  faUserCircle, faUser, faEnvelope, faLock, faBackspace, faEyeSlash, faEye, faSignOutAlt,
  faCheckCircle, faKey, faInfoCircle, faArrowCircleLeft,

  // maze
  faWaveSquare, faShoePrints, faFlag, faPlayCircle, faStopCircle, faArrowUp,
  faArrowDown, faArrowRight, faArrowLeft, faStopwatch,

  // memoji
  faLightbulb,

  // tic tac toe
  faRobot, faEraser,

  // comments
  faComments, faTrashAlt, faUserCog, // faLongArrowAltLeft

  // rating
  faStarHalfAlt, faStar, faSmile, faGrinHearts, faMeh, 
  faFrown, faAngry, faTimes,

  // snake
  faAppleAlt, faTh
)

export default FontAwesomeIcon;