/**
 * @license MIT
 * Copyright (c) 2025 Elpusk.Co.,Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { elpusk } from "./elpusk";
export declare class device extends elpusk {
    /**
     * The path of the device.
     * @private
     */
    private _s_path;
    /**
     * The index of the device. 0 is an undefined index number.
     * @private
     */
    private _n_device_index;
    /**
     * @class elpusk.device
     * @classdesc Represents a device.
     * @param s_path The path of the device.
    */
    constructor(s_path: string);
    /**
     * Gets the device path.
     * @returns The device path.
     */
    get_path(): string;
    /**
     * Gets the index of the device.
     * @returns The index of the device. 0 is an unknown index value.
     */
    get_device_index(): number;
    /**
     * Sets the device index when the device is opened.
     * @param n_device_index The index of the device. 0 is an unknown index value.
     */
    opened(n_device_index: number): void;
    /**
     * Resets the device index when the device is closed.
     */
    closed(): void;
}
