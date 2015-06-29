//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    /** Responsible for responding to changes to the conceptual schema. */
    export interface IQueryCacheHandler {
        /** Applies changes to the given exploration. */
        apply(queryProxy: IDataProxy, changes: SchemaChange[]): void;
    }

    export function createQueryCacheHandler(): IQueryCacheHandler {
        return new QueryCacheHandler();
    }

    interface IQueryBindingDescriptorRewriter extends IQueryBindingDescriptorVisitorWithArg<string> {
    }

    class QueryCacheHandler implements IQueryCacheHandler {
        public apply(queryProxy: IDataProxy, changes: SchemaChange[]): void {
            var rewriter = new QueryCacheRewriter(changes);
            queryProxy.rewriteCacheEntries('dsr', rewriter);
        }
    }

    class QueryCacheRewriter implements ISemanticQueryCacheRewriter {
        private descriptorRewriters: IQueryBindingDescriptorRewriter[];
        private schemaRewriters: data.SQExprRewriter[];

        constructor(changes: SchemaChange[]) {
            this.descriptorRewriters = createQueryBindingDescriptorRewriters(changes);
            this.schemaRewriters = createSchemaChangeRewriters(changes);
        }

        public rewriteCacheKey(cacheKey: CacheKeyObject): CacheKeyObject {
            var SemanticQuerySerializer = data.services.SemanticQuerySerializer;
            var rewriters = this.schemaRewriters;
            var command = <data.SemanticQueryDataShapeCommand>cacheKey.command;
            var query = SemanticQuerySerializer.deserializeQuery(command.Query);
            for (var i = 0, length = rewriters.length; i < length; i++)
                query = query.rewrite(rewriters[i]);
            command.Query = SemanticQuerySerializer.serializeQuery(query);
            cacheKey.command = command;
            return cacheKey;
        }

        public rewriteCacheResult(result: DataViewData): DataViewData {
            var rewriters = this.descriptorRewriters;            
            for (var i = 0, length = rewriters.length; i < length; i++){
                var rewriter = rewriters[i];
                traverseQueryBindingDescriptorWithArg(result.descriptor, rewriter, result.schemaName);
            }
            return result;
        }
    }

    function createQueryBindingDescriptorRewriters(changes: SchemaChange[]): IQueryBindingDescriptorRewriter[] {
        debug.assertValue(changes, 'changes');
        var rewriters: IQueryBindingDescriptorRewriter[] = [];
        for (var i = 0, length = changes.length; i < length; i++) {
            var change = changes[i];
            if (change.entityRename) {
                rewriters.push(new QueryBindingDescriptorEntityRewriter(change.entityRename));
            }
            if (change.propertyRename) {
                rewriters.push(new QueryBindingDescriptorPropertyRewriter(change.propertyRename));
            }
        }
        return rewriters;
    }

    class QueryBindingDescriptorEntityRewriter extends DefaultQueryBindingDescriptorVisitor<string> implements IQueryBindingDescriptorRewriter {
        private change: SchemaChangeType.EntityRename;

        constructor(change: SchemaChangeType.EntityRename) {
            super();
            this.change = change;
        }
        public visitConceptualPropertyReference(propertyRef: ConceptualPropertyReference, schemaName: string): void {
            if (this.change.schema === schemaName && propertyRef.Entity === this.change.before)
                propertyRef.Entity = this.change.after;
        }
    }

    class QueryBindingDescriptorPropertyRewriter extends DefaultQueryBindingDescriptorVisitor<string> implements IQueryBindingDescriptorRewriter {
        private change: SchemaChangeType.PropertyRename;

        constructor(change: SchemaChangeType.PropertyRename) {
            super();
            this.change = change;
        }
        public visitConceptualPropertyReference(propertyRef: ConceptualPropertyReference, schemaName: string): void {
            if (this.change.schema === schemaName && propertyRef.Property === this.change.before)
                propertyRef.Property = this.change.after;
        }
    }
}