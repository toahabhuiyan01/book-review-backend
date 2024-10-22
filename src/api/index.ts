import routes from "../routes";
import makeApi from "./make-api";

export default function handler(req, res) {
    const api = makeApi('build/api/openapi.yaml', routes)
    api.handleRequest(
        {
            method: req.method,
            path: req.path,
            body: req.body,
            query: req.query as {[key: string]: string | string[]},
            headers: req.headers as {[key: string]: string | string[]},
        },
        req,
        res
    )
}