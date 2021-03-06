import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import Avatar from '@material-ui/core/Avatar';
import DidAuth from '@arcblock/did-react/lib/Auth';
import Button from '@arcblock/ux/lib/Button';

import Layout from '../components/layout';
import Game from '../components/game';
import { SessionContext } from '../libs/session';

export default function IndexPage() {
  const { session, api } = useContext(SessionContext);
  const { chainId, assetChainId } = window.env;
  const { [chainId]: chain, [assetChainId]: assetChain } = session;

  return (
    <Layout title="Home">
      <Main>
        <div className="header">
          <h1 className="animated fadeInRightBig">Crypto 2048</h1>
          <Avatar className="user-avatar" variant="circle" src={session.user.avatar} alt={session.user.name} />
        </div>
        <p>
          Use arrow keys to play game.
          <br />
          Press 'N' to start a new game (each start will cost 2 coins)
        </p>
        <div id="main">
          <Game chainInfo={{ chain, assetChain }} />
        </div>
        <div className="buttons"></div>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-size: 40px;
      margin: 0;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
    }
  }

  table {
    margin: 0 auto;
  }

  .meta,
  .buttons {
    width: 410px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 24px auto;
  }

  .cell {
    height: 100px;
    width: 100px;
    background-color: #d0d0d0;
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
`;
