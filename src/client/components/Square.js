import React, { Component } from 'react';

const Square = (props) => {
  const { id, pieces, highlight } = props;
  var color = 'black';
  if( (Math.floor(id / 8) % 2 === 0 && id % 2 === 0) || (Math.floor(id / 8) % 2 === 1 && id % 2 === 1) )
    color = 'white';
  var piece;
  if( pieces.red[id] === 'k' ) {
    piece = <div className="red-piece piece king" />;
  }
  else if( pieces.blue[id] === 'k') {
    piece = <div className="blue-piece piece king" />;
  }
  else if( pieces.red[id] === 'n') {
    piece = <div className="red-piece piece" />;
  }
  else if( pieces.blue[id] === 'n') {
    piece = <div className="blue-piece piece" />;
  }
  else if( pieces.possible[id] === 'p') {
    piece = <div className="possible piece" />;
  }
  else {
    piece = <div className="no-piece" />;
  }
  
  return (
    <div className="square" style={{backgroundColor: color}} onClick={()=> {highlight(id)}} >
      {piece}
    </div>
  );
};

export default Square;