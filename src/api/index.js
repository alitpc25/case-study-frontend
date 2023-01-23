import axios from "axios";
import { toastError, toastSuccess } from "../utils/toastMessages";

export const updateCandidate = async (values, candidateId) => {
    try {
        const response = await axios.patch(`/api/v1/candidates/updateInfo/${candidateId}`,
            {
                mail: values.mail,
                phone: values.phone,
                status: values.status,
            });
        toastSuccess("Candidate " + response.data.name + " successfully edited.")
    } catch (error) {
        toastError(error.response.data);
    }
}

export const createCandidate = async (data) => {
    await axios.post('/api/v1/candidates', data)
            .then(function (response) {
                toastSuccess("Candidate successfully added.");
            })
            .catch(function (error) {
                toastError(error.response.data);
            })
}

export const deleteCandidate = async (candidateId) => {
    await axios.delete(`/api/v1/candidates/${candidateId}`)
            .then(function (response) {
                toastSuccess("Candidate successfully removed.");
            })
            .catch(function (error) {
                toastError(error.response.data);
            })
}

export const getAllCandidates = async (currentPage, candidatesPerPage) => {
    try {
        return await axios.get(`/api/v1/candidates?page=${currentPage}&size=${candidatesPerPage}`)
    } catch (error) {
        toastError(error.response.data);
    }
}

export const getAllCandidatesSorted = async (currentPage, candidatesPerPage, sortedBy, sortOrder) => {
    try {
        return await axios.get(`/api/v1/candidates?page=${currentPage}&size=${candidatesPerPage}&sortedBy=${sortedBy}&sortOrder=${sortOrder}`);
    } catch (error) {
        toastError(error.response.data)
    }
}

export const findCandidateByNameAndSurname = async (currentPage, candidatesPerPage, name, surname) => {
    axios.get(`/api/v1/candidates?page=${currentPage}&size=${candidatesPerPage}&name=${name}&surname=${surname}`)
        .then((response) => {
        }).catch(function (error) {
            toastError(error.response.data);
        })
}




export const createInteraction = async (data, candidateId) => {
    axios.post('/api/v1/interactions?candidateId=' + candidateId, data)
    .then(function (response) {
        toastSuccess("Interaction successfully added.");
    })
    .catch(function (error) {
        toastError(error.response.data);
    })
}

export const updateInteraction = async (data, interactionId) => {
    axios.patch('/api/v1/interactions/' + interactionId, data)
    .then(function (response) {
        toastSuccess("Interaction info successfully updated.");
    })
    .catch(function (error) {
        toastError(error.response.data);
    })
}

export const deleteInteraction = async (interactionId) => {
    axios.delete('/api/v1/interactions/' + interactionId)
            .then(function (response) {
                toastSuccess(response.data);  
            })
            .catch(function (error) {
                toastError(error.response.data);
            })
}