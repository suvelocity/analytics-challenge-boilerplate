import { props } from "bluebird";
import styled from "styled-components";

export const ChartsLayout = styled.div`
  @media only screen and (max-width: 600px) {
    background-color: red;
    font-size: 50px;
  }

  background-color: yellow;
  /* display: grid; */
  /* grid-template-areas:
    "chart1 chart1 chart1 chart1 chart1 chart1"
    "chart2 chart2 chart2 chart2 chart3 chart3"
    "chart4 chart4 chart4 chart5 chart5 chart5"; */

  /* grid-template-rows: minmax(400px, 50vw); */
  left: 50%;
  margin-left: -40vw;
  max-width: 100vw;
  position: relative;
  right: 50%;
  width: 80vw;

  #chart1 {
    width: 80%;
    height: 33vh;
    /* background-color: ${(props) => props.theme.body.background};
    color: ${(props) => props.theme.body.text}; */
  }
  #chart2 {
    width: 70%;
    height: 33vh;
    /* background-color: ${(props) => props.theme.body.background};
    color: ${(props) => props.theme.body.text}; */
    /* grid-area: chart2; */
  }
  #chart3 {
    width: 25%;
    height: 40vh;
    /* background-color: cyan;
    grid-area: chart3; */
  }
  .chart4 {
    width: 100%;
    height: 100%;
    /* background-color: green;
    grid-area: chart4; */
  }
  .chart5 {
    width: 100%;
    height: 100%;
    background-color: pink;
    grid-area: chart5;
  }
`;
