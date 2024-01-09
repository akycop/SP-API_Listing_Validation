import * as Instance from "@hyperjump/json-schema/instance/experimental";
import * as Browser from "@hyperjump/browser";

const compile = async(schema: any, ast: any, parentSchema: any): Promise<[number, string[]]> => {
    const maxUniqueItems = Browser.value(schema) as number;
    const parentSchemaItems = Browser.value(parentSchema) as any;
    const selectors = parentSchemaItems.selectors as string[];
    return [maxUniqueItems, selectors];
}

const interpret = ([maxUniqueItems, selectors]: [number, string[]], instance: any, ast: any): boolean => {
    if (! (Instance.typeOf(instance) === "array") ) {
        return false;
    }

    let uniqueItems: string[] = [];
    instance.value.forEach((inst: any) => {

        let selectorCombination: { [key: string]: any } = {};
        Object.entries(inst).forEach(([key, value]) => {
            if (selectors != undefined && selectors.includes(key)) {
                selectorCombination[key] = value;
            }
        });
        uniqueItems.push(JSON.stringify(selectorCombination));
    });

    let countMap: Map<string, number> = new Map();
    uniqueItems.forEach(item => {
        countMap.set(item, (countMap.get(item) || 0) + 1);
    });

    let filteredItems = Array.from(countMap.entries()).filter(item => {
        return item[1] > maxUniqueItems;
    });

    return filteredItems.length > 0 ? false : true;
};

export { compile, interpret };
