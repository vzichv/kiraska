import './objectsTable.sass';

import { observer } from 'mobx-react-lite';

import Store from './../../store';

const TableWithDetails = observer((props) => {
  const { allDetails, detailsWithOnlyChanges, fullInfo } = props;

  function filter(details) {
    const result = details.filter( row => {
      try {
        const countStr = row[Store.filters.count.name].props.children;     // '3 -> 10 (7)'
        const countNum = Number(countStr.split('(')[1].replace(/\D/g,'')); // 7
        const correctFilter = Number(Store.filters.count.filter);
        return countNum > correctFilter;
      } 
      catch(error) {
        return false;
      }
    });

    if (result.length < 1) {
      return details;
    }
    return result;
  }

  function generateTableHeaders(details) {
    return Object.keys(details[0]).map( function(header, index) {
      if (index !== 0) return <th key={index}>{ header }</th>;
      else return <></>;
    });
  }

  function generateTableBody(details) {
    try {
      let detailsType = fullInfo ? details : filter(details); 
      return detailsType.map( function(detail, detailIndex) {
        return ( 
          <tr key={ detailIndex }>
            { 
              Object.keys(details[0]).map( function(header, headerIndex) {
                if (headerIndex !== 0) return <td key={ headerIndex }>{ detail[header] }</td>;
                else return <></>;
              })
            }
          </tr>
        );
      });
    }
    catch(error) {
      document.location.reload(true);
      console.log(error);
    }
  }

  return (
    <>
      {allDetails.length > 0 ? 
        <table id='changes-table' className='ObjectsTable'>
          <thead>
            <tr>
              { generateTableHeaders(allDetails) }
            </tr>
            { generateTableBody(allDetails) }
          </thead>
        </table> : <></>
      }
    </>
  );
});

export default TableWithDetails;
