import { props } from "bluebird";
import styled from "styled-components";

export const ChartsLayout = styled.div`
  @media only screen and (max-width: 600px) {
    background-color: red;
  }

  background-color: yellow;
  /* display: grid; */
  /* grid-template-areas:
    "chart1 chart1 chart1 chart1 chart1 chart1"
    "chart2 chart2 chart2 chart2 chart3 chart3"
    "chart4 chart4 chart4 chart5 chart5 chart5"; */

  /* grid-template-rows: minmax(400px, 50vw); */
  left: 50%;
  margin-top: -10vh;
  margin-left: -40vw;
  max-width: 100vw;
  position: relative;
  right: 50%;
  width: 80vw;

  #chart1,
  #chart2 {
    width: 45%;
    height: 40vh;
    padding: 2vw;
    /* background-color: ${(props) => props.theme.body.background};
    color: ${(props) => props.theme.body.text}; */
  }
  #chart2 {
    /* width: 45%;
    height: 40vh; */
    /* background-color: ${(props) => props.theme.body.background};
    color: ${(props) => props.theme.body.text}; */
    /* grid-area: chart2; */
  }
  .pie-charts {
    width: 25%;
    height: 40vh;
    /* background-color: cyan;
    grid-area: chart3; */
  }

  #retention {
    width: 95%;
    height: 75vh;
    margin: 5vh auto;
  }
  #all-events {
    width: 95%;
    height: 35%;
    margin: 0 auto;
    /* background-color: green;
    grid-area: chart4; */
  }
  #locations {
    width: 100%;
    height: 100%;
    background-color: pink;
  }
`;
