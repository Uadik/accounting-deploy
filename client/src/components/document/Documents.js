import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DocumentForm from './DocumentForm';
import { Spinner } from '../layout';
import {
  getDocuments,
  deleteDocument,
  clearDocuments,
} from '../../store/actions/documents';

const Documents = ({
  match,
  documents: { documents: documentsArray, documentsLoading },
  company,
  getDocuments,
  deleteDocument,
  clearDocuments,
}) => {
  const [isFormShown, toggleForm] = useState(false);
  // const history = useHistory();

  useEffect(() => {
    getDocuments(company);

    return clearDocuments;
  }, [getDocuments]);

  if (documentsLoading) return <Spinner />;

  return (
    <Fragment>
      <div>
        <button
          onClick={() => {
            toggleForm(!isFormShown);
          }}
          className="btn btn-primary my-1"
        >
          {isFormShown ? 'Hide Form' : 'Add Document'}
        </button>
      </div>

      {isFormShown ? <DocumentForm companyId={company} /> : null}

      {!documentsArray.length ? (
        <p>No documents found</p>
      ) : (
        <Fragment>
          {documentsArray.map((document, index) => {
            return (
              <div
                key={document._id}
                className={index % 2 === 0 ? 'background-blue' : ''}
              >
                <h2 className="inline-block">{document.name}</h2>
                <div className="operation-buttons">
                  <i className="far fa-edit mx-1"></i>
                  <i
                    onClick={() => {
                      deleteDocument(document._id);
                    }}
                    className="fas fa-trash-alt"
                  ></i>
                </div>
              </div>
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
};

Documents.propTypes = {
  documents: PropTypes.object.isRequired,
  getDocuments: PropTypes.func.isRequired,
  company: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  documents: state.documents,
  company: state.company.firm._id,
});

export default connect(mapStateToProps, {
  getDocuments,
  deleteDocument,
  clearDocuments,
})(Documents);
