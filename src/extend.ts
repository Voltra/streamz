import { Stream } from "./stream";

/**
 * Helper function that installs global extensions
 * @param ctx - The context on which it will be installed (e.g. window, global, self, this, etc...)
 */
export const extend = ctx => {
    if(ctx.Array){
        ctx.Array.prototype.stream = function(){
            return Stream.from(this);
        }
    }

    if(ctx.Object){
        ctx.Object.prototype.stream = function(){
            return Stream.fromObject(this);
        }

        ctx.Object.fromStreams = Stream.zipToObject.bind(Stream);
    }

    if(ctx.Map){
        ctx.Map.prototype.stream = function(){
            return Stream.fromMap(this);
        }
    }

    if(ctx.Set){
        ctx.Set.prototype.stream = function(){
            return Stream.fromSet(this);
        }
    }

    if(ctx.Number){
        ctx.Number.range = Stream.range.bind(Stream);
        ctx.Number.infiniteRange = Stream.infinite.bind(Stream);
    }
}