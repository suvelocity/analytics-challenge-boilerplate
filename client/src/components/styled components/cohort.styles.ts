import styled, { createGlobalStyle } from 'styled-components';

export const AdminCard = styled.div`
    position: relative;
    max-width: 100%;
    max-height: 100%;
    background: #ebfeff;
    border-radius: 10px;
    border: 2px solid #0085a3;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    h2 {
        position: absolute;
        top: 10px;
        left: 10px;
    }
`

export const ChartWrapper = styled.div`
    width: 100%;
    height: 100%;
    min-height: 35vh;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 200px;
`

export const EventLogWrapper = styled.div`
    max-width: 100%;
    min-height: 35vh;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow-y: scroll;
    overflow-x: hidden;
`

export const MapWrapper = styled.div`
    width: 50vw;
    height: 30vw;
    padding-top: 80px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 200px;
`

export const FormWrapper = styled.div`
    max-width: 80%;
    height: 50%;
    margin: 0 auto;
    position: relative;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
`

export const DatePickerWrapper = styled.div`
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const TableEmptySquare = styled.div`
    width: 80px;
    height: 60px;
    border: 2px solid #0085a3;
    background: #ffff;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
`

export const TableElement = styled.table`

th, td, tr {
    width: 80px;
    height: 60px;
    border: 2px solid #0085a3;
    background: #ffff;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}
`
