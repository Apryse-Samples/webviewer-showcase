import { Core } from '@pdftron/webviewer'
import { createSlice,  PayloadAction } from '@reduxjs/toolkit'

type Dimensions = {
    width: number, 
    height: number
}

type WebViewerState = {
    viewerDimensions?: Dimensions,
    loadingDocument: boolean,
    document?: Core.Document,
    extension?: string
}

const initialState: WebViewerState = {
    loadingDocument: false,
}

const webviewerSlice = createSlice({
    name: 'webviewer',
    initialState,
    reducers: {
        setViewerDimensions: (state, action: PayloadAction<Dimensions>) =>{
            state.viewerDimensions = action.payload;
        },
        wvLoadDocument: (state) => {
            state.loadingDocument = true;
            state.document = undefined;
        },
        wvDocumentLoaded: (state, action: PayloadAction<Core.Document>) => {
            state.loadingDocument = false;
            state.document = action.payload;
            state.document.getEx
            state.extension = action.payload.extension;
        },
 
    }
});

export const { setViewerDimensions, wvLoadDocument, wvDocumentLoaded } = webviewerSlice.actions;

export default webviewerSlice.reducer;