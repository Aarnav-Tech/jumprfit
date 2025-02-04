import { allModels } from './.stackbit/models';
import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

type SiteMapEntry = {
  stableId: string;
  urlPath: string;
  document: any;
  isHomePage: boolean;
};

const config = defineStackbitConfig({
    contentSources: [
        new GitContentSource({
            rootPath: __dirname,
            contentDirs: ["content"],
            models: [
                {
                    name: "Page",
                    type: "page",
                    urlPath: "/{slug}",
                    filePath: "content/pages/{slug}.json",
                    fields: [{ name: "title", type: "string", required: true }]
                }
            ],
        })
    ],
    siteMap: ({ documents, models }) => {
        const pageModels = models.filter((m) => m.type === "page");

        return documents
            .filter((d) => pageModels.some(m => m.name === d.modelName))
            .map((document) => {
                const urlModel = (() => {
                    switch (document.modelName) {
                        case 'Page':
                            return 'otherPage';
                        case 'Blog':
                            return 'otherBlog';
                        default:
                            return null;
                    }
                })();

                return {
                    stableId: document.id,
                    urlPath: `/${urlModel}/${document.id}`,
                    document,
                    isHomePage: false,
                };
            })
            .filter(Boolean) as SiteMapEntry[];
    },
    stackbitVersion: '~0.7.0',
    ssgName: 'nextjs',
    nodeVersion: '18',
    presetSource: {
        type: 'files',
        presetDirs: ['./.stackbit/presets']
    },
    styleObjectModelName: 'ThemeStyle'
});

export default config;
