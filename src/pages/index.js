import React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout';
import Game from '../components/game';

export default function IndexPage() {
  return (
    <Layout title="Home">
      <Main>
        <h1 className="animated fadeInRightBig">2048</h1>
        <p>Use the buttons or arrow keys to play game. Press 'N' to start a new game.</p>
        <div id="main">
          <Game />
        </div>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  a {
    color: ${props => props.theme.colors.green};
    text-decoration: none;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-description {
    margin-bottom: 30px;
  }

  h1 {
    text-align: center;
    font-size: 50px;
  }

  p {
    text-align: center;
  }

  table {
    margin: 0 auto;
  }

  .buttons {
    margin: 0 auto;
    display: flex;
    width: 500px;
  }

  .button {
    background-color: #303030;
    color: #50c8ff;
    height: 30px;
    width: 100px;
    border-radius: 5px;
    margin: 0 auto;
    margin-bottom: 25px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.5s, color 0.5s;
  }

  .button:hover {
    background-color: #50c8ff;
    color: #303030;
    transition: background-color 0.5s, color 0.5s;
  }

  .cell {
    height: 100px;
    width: 100px;
    background-color: #D0D0D0;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .color-2 {
    background-color: #50c8ff;
  }

  .color-4 {
    background-color: green;
  }

  .color-8 {
    background-color: red;
  }

  .color-16 {
    background-color: orange;
  }

  .color-32 {
    background-color: yellow;
    .number {
      color: #222;
    }
  }

  .color-64 {
    background-color: blue;
  }

  .color-128 {
    background-color: purple;
  }

  .color-256 {
    background-color: pink;
  }

  .color-512 {
    background-color: #50c8ff;
  }

  .color-1024 {
    background-color: green;
  }

  .color-2048 {
    background-color: blue;
  }

  .number {
    color: #fff;
    font-size: 35px;
  }

  .score {
    text-align: center;
    margin-bottom: 20px;
  }
`;
