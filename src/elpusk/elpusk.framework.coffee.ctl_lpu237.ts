/**
 * 2020.10.8
 * @license MIT
 * Copyright (c) 2020 Elpusk.Co.,Ltd.
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
 * 
 * @author developer 00000006
 * @copyright Elpusk.Co.,Ltd 2025
 * @version 1.7.0
 * @description lpu237 controller of elpusk framework coffee typescript library.
 */

'use strict';

import { coffee } from './elpusk.framework.coffee';
import { lpu237 } from './elpusk.device.usb.hid.lpu237';

/**
 * @readonly
 * @enum {number}
 */
enum _type_status {
    ST_UNDEFINED = -1,
    ST_IDLE = 0,
    ST_WAIT_RSP = 1,
    ST_WAIT_READ_DATA = 2,
    ST_WAIT_CANCEL = 3
}

/**
 * Parameter interface for queue
 */
interface IQueueParameter {
    server: coffee;
    device: lpu237;
    resolve?: (value: string) => void;
    reject?: (reason: Error) => void;
    b_read?: boolean;
    cb_received?: (n_device_index: number, s_data: string) => void;
    cb_error?: (n_device_index: number, error: Error) => void;
    cb_progress?: (n_device_index: number, stage_max: number, stage_cur: number) => void;
    stage_max?: number;
    stage_cur?: number;
}

export class ctl_lpu237{

    /**
     * map of queue of promise resolve & reject.
     */
    private const _map_q_para = new Map<number, IQueueParameter[]>();

    /**
     * map of device status
     */
    private const _map_status = new Map<number, _type_status>();


    /**
     * Get status
     */
    private _get_status(n_device_index: number): _type_status {
        let st = _type_status.ST_UNDEFINED;

        do {
            if (typeof n_device_index !== 'number') {
                continue;
            }
            if (n_device_index <= 0) {
                continue;
            }

            st = _type_status.ST_IDLE;
            if (!this._map_status.has(n_device_index)) {
                this._map_status.set(n_device_index, st);
                continue;
            }
            st = this._map_status.get(n_device_index)!;
        } while (false);
        return st;
    }

    /**
     * Set status
     */
    private _set_status(n_device_index: number, new_status: _type_status): void {
        do {
            if (typeof n_device_index !== 'number') {
                continue;
            }
            if (n_device_index <= 0) {
                continue;
            }
            if (typeof new_status === 'undefined') {
                continue;
            }

            switch (new_status) {
                case _type_status.ST_IDLE:
                case _type_status.ST_WAIT_RSP:
                case _type_status.ST_WAIT_READ_DATA:
                case _type_status.ST_WAIT_CANCEL:
                    break;
                default:
                    continue;
            }

            this._map_status.set(n_device_index, new_status);
        } while (false);
    }  
    

/**
 * Generate get system info start IO
 */
private _gen_get_sysinfo_start_io(
    server: coffee,
    device: lpu237,
    cb_complete_sys_info: (n_device_index: number, s_rx: Array<string> | string) => void,
    cb_error_sys_info: (n_device_index: number, error: Error) => void
): number {
    let n_req = 0;
    let s_request: string | null = null;

    do {
        device.clear_transaction();

        n_req = device.generate_get_system_information();
        if (n_req <= 0) {
            continue;
        }
        s_request = device.get_tx_transaction();
        if (s_request === null) {
            n_req = 0;
            continue;
        }

        const b_result = server.device_transmit_with_callback(
            device.get_device_index(), 0, 0, s_request,
            cb_complete_sys_info,
            cb_error_sys_info,
            true
        );
        if (!b_result) {
            n_req = 0;
            device.clear_transaction();
            continue;
        }
    } while (false);
    return n_req;
}

/**
 * Generate get parameter start IO
 */
function _gen_get_para_start_io(
    server: coffee,
    device: lpu237,
    cb_complete_get_parameter: (n_device_index: number, s_rx: Array<string> | string) => void,
    cb_error_get_parameter: (n_device_index: number, error: Error) => void
): number {
    let s_request: string | null = null;
    let n_req = 0;

    do {
        device.clear_transaction();

        n_req = device.generate_get_parameters();
        if (n_req <= 0) {
            n_req = 0;
            continue;
        }

        s_request = device.get_tx_transaction();
        if (s_request === null) {
            n_req = 0;
            continue;
        }

        const b_result = server.device_transmit_with_callback(
            device.get_device_index(), 0, 0, s_request,
            cb_complete_get_parameter,
            cb_error_get_parameter,
            true
        );
        if (!b_result) {
            device.clear_transaction();
            n_req = 0;
            continue;
        }
    } while (false);
    return n_req;
}

/**
 * Generate set parameter start IO
 */
function _gen_set_para_start_io(
    server: coffee,
    device: lpu237,
    cb_complete_set_parameter: (n_device_index: number, s_rx: Array<string> | string) => void,
    cb_error_set_parameter: (n_device_index: number, error: Error) => void
): number {
    let s_request: string | null = null;
    let n_req = 0;

    do {
        device.clear_transaction();

        n_req = device.generate_set_parameters();
        if (n_req <= 0) {
            continue;
        }

        s_request = device.get_tx_transaction();
        if (s_request === null) {
            n_req = 0;
            continue;
        }

        const b_result = server.device_transmit_with_callback(
            device.get_device_index(), 0, 0, s_request,
            cb_complete_set_parameter,
            cb_error_set_parameter,
            true
        );
        if (!b_result) {
            device.clear_transaction();
            n_req = 0;
            continue;
        }
    } while (false);
    return n_req;
}

/**
 * Generate OPOS start IO
 */
function _gen_opos_start_io(
    server: coffee,
    device: lpu237,
    cb_complete_changed_opos: (n_device_index: number, s_rx: Array<string> | string) => void,
    cb_error_changed_opos: (n_device_index: number, error: Error) => void,
    b_read: boolean
): boolean {
    let b_result = false;
    let s_request: string | null = null;
    let n_req = 0;

    do {
        device.clear_transaction();

        n_req = device.generate_enable_read(b_read);
        if (n_req <= 0) {
            continue;
        }

        s_request = device.get_tx_transaction();
        if (s_request === null) {
            continue;
        }

        b_result = server.device_transmit_with_callback(
            device.get_device_index(), 0, 0, s_request,
            cb_complete_changed_opos,
            cb_error_changed_opos,
            true
        );
        if (!b_result) {
            device.clear_transaction();
            continue;
        }

        b_result = true;
    } while (false);
    return b_result;
}

/**
 * Cancel start IO
 */
function _cancel_start_io(
    server: coffee,
    device: lpu237,
    cb_complete_cancel: (n_device_index: number, s_rx: Array<string> | string) => void,
    cb_error_cancel: (n_device_index: number, error: Error) => void
): boolean {
    let b_result = false;

    do {
        b_result = server.device_cancel_with_callback(
            device.get_device_index(), 0, 0,
            cb_complete_cancel,
            cb_error_cancel,
            true
        );
    } while (false);
    return b_result;
}

/**
 * Generate run bootloader start IO
 */
function _gen_run_bootloader_start_io(
    server: coffee,
    device: lpu237,
    cb_complete_run_bootloader: (n_device_index: number, s_rx: Array<string> | string) => void,
    cb_error_run_bootloader: (n_device_index: number, error: Error) => void
): boolean {
    let b_result = false;
    let s_request: string | null = null;
    let n_req = 0;

    do {
        device.clear_transaction();

        n_req = device.generate_run_bootloader();
        if (n_req <= 0) {
            continue;
        }

        s_request = device.get_tx_transaction();
        if (s_request === null) {
            continue;
        }

        b_result = server.device_transmit_with_callback(
            device.get_device_index(), 0, 0, s_request,
            cb_complete_run_bootloader,
            cb_error_run_bootloader,
            true
        );
        if (!b_result) {
            device.clear_transaction();
            continue;
        }

        b_result = true;
    } while (false);
    return b_result;
}

/**
 * Generate iButton start IO
 */
function _gen_ibutton_start_io(
    server: coffee,
    device: lpu237,
    cb_complete_ibutton: (n_device_index: number, s_rx: Array<string> | string) => void,
    cb_error_ibutton: (n_device_index: number, error: Error) => void
): boolean {
    let b_result = false;

    do {
        device.clear_transaction();

        b_result = server.device_receive_with_callback(
            device.get_device_index(),
            0,
            cb_complete_ibutton,
            cb_error_ibutton,
            true
        );
        if (!b_result) {
            device.clear_transaction();
            continue;
        }

        b_result = true;
    } while (false);
    return b_result;
}

/**
 * Notify error
 */
function _notifiy_error(parameter: IQueueParameter, event_error?: Error): void {
    do {
        if (typeof parameter !== 'object') {
            continue;
        }

        let e: Error;
        if (event_error instanceof Error) {
            e = event_error;
        } else {
            e = new Error("error");
        }
        if (parameter.reject) {
            parameter.reject(e);
            continue;
        }
        if (parameter.cb_error) {
            parameter.cb_error(parameter.device.get_device_index(), e);
        }
    } while (false);
}

/**
 * Notify error all
 */
function _notifiy_error_all(n_device_index: number, event_error?: Error): void {
    do {
        if (typeof n_device_index !== 'number') {
            continue;
        }
        if (!this._map_q_para.has(n_device_index)) {
            continue;
        }

        const q = this._map_q_para.get(n_device_index)!;
        if (q.length <= 0) {
            elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
            continue;
        }

        for (let i = 0; i < q.length; i++) {
            _notifiy_error(q[i], event_error);
        }
        elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
    } while (false);
}

/**
 * Notify error map
 */
function _notifiy_error_map(event_error?: Error): void {
    do {
        this._map_q_para.forEach((value, key) => {
            _notifiy_error_all(key, event_error);
        });
        elpusk.util.map_of_queue_clear(this._map_q_para);
    } while (false);
}

/**
 * Notify received
 */
function _notifiy_received(parameter: IQueueParameter): void {
    do {
        if (typeof parameter !== 'object') {
            continue;
        }

        if (parameter.resolve) {
            parameter.resolve("success");
            continue;
        }
        if (parameter.cb_received) {
            parameter.cb_received(parameter.device.get_device_index(), "success");
        }
    } while (false);
}

/**
 * Is event response good
 */
function _is_event_rsp_good(device: lpu237, s_rx: Array<string> | string): boolean {
    let b_result = false;
    do {
        if (Array.isArray(s_rx)) {
            if (s_rx[0] !== "success") {
                continue;
            }
        } else {
            if (!device.set_rx_transaction(s_rx)) {
                continue;
            }
            if (!device.set_from_rx()) {
                continue;
            }
        }
        b_result = true;
    } while (false);
    return b_result;
}

/**
 * Is event response cancel
 */
function _is_event_rsp_cancel(s_rx: Array<string> | string): boolean {
    let b_result = false;
    do {
        if (!Array.isArray(s_rx)) {
            continue;
        }
        if (s_rx[0] !== "cancel") {
            continue;
        }
        b_result = true;
    } while (false);
    return b_result;
}

/**
 * Process response event in idle
 */
function _process_rsp_event_in_idle(n_device_index: number): void {
    _notifiy_error_all(n_device_index);
    elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
}

/**
 * Process response event in wait response
 */
function _process_rsp_event_in_wait_rsp(n_device_index: number, s_rx: Array<string> | string): void {
    do {
        const para = elpusk.util.map_of_queue_get(this._map_q_para, n_device_index);
        if (!para) {
            continue;
        }
        if (!_is_event_rsp_good(para.device, s_rx)) {
            continue;
        }
        //e_rsp_good
        if (para.b_read) {
            const b_result = para.server.device_receive_with_callback(
                n_device_index, 0,
                _cb_complete_rsp,
                _cb_error_frame,
                true
            );
            if (!b_result) {
                continue;
            }
            _set_status(n_device_index, _type_status.ST_WAIT_READ_DATA);
        } else {
            _notifiy_received(para);
            elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
            _set_status(n_device_index, _type_status.ST_IDLE);
        }
        return;
    } while (false);

    _notifiy_error_all(n_device_index);
    elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
    _set_status(n_device_index, _type_status.ST_IDLE);
}

/**
 * Process response event in wait card
 */
function _process_rsp_event_in_wait_card(n_device_index: number, s_rx: Array<string> | string): void {
    do {
        if (_is_event_rsp_cancel(s_rx)) {
            //event e_rsp_cancel
            _notifiy_error(elpusk.util.map_of_queue_front(this._map_q_para, n_device_index)!);
            _set_status(n_device_index, _type_status.ST_WAIT_CANCEL);
            return;
        }

        const para = elpusk.util.map_of_queue_get(this._map_q_para, n_device_index);
        if (!para) {
            continue;
        }
        if (para.device.get_type_string() == "compositive_msr") {
            if (!para.device.set_msr_data_from_rx(s_rx)) {
                continue;
            }
        } else if (para.device.get_type_string() == "compositive_ibutton") {
            if (!para.device.set_ibutton_data_from_rx(s_rx)) {
                continue;
            }
        } else {
            // error. not supported device type
            continue;
        }

        //event e_rsp_card
        if (para.resolve) {
            //the end of waiting for promise type
            const removed_para = elpusk.util.map_of_queue_front(this._map_q_para, n_device_index)!;
            _set_status(n_device_index, _type_status.ST_IDLE);
            _notifiy_received(removed_para);
            return;
        }
        _notifiy_received(para);
        //re-waiting card data for callback type
        const b_result = para.server.device_receive_with_callback(
            n_device_index, 0,
            _cb_complete_rsp,
            _cb_error_frame,
            true
        );
        if (!b_result) {
            continue;
        }
        return;
    } while (false);

    _notifiy_error_all(n_device_index);
    elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
    _set_status(n_device_index, _type_status.ST_IDLE);
}

/**
 * Process response event in wait cancel
 */
function _process_rsp_event_in_wait_cancel(n_device_index: number, s_rx: Array<string> | string): void {
    do {
        const para = elpusk.util.map_of_queue_get(this._map_q_para, n_device_index);
        if (!para) {
            continue;
        }
        if (!_is_event_rsp_good(para.device, s_rx)) {
            continue;
        }

        //e_rsp_good
        let b_result = false;

        if (para.device.get_type_string() == "compositive_msr") {
            //to OPOS mode
            b_result = _gen_opos_start_io(para.server, para.device, _cb_complete_rsp, _cb_error_frame, para.b_read!);
            if (!b_result) {
                continue;
            }
            _set_status(para.device.get_device_index(), _type_status.ST_WAIT_RSP);
            return;
        }
        if (para.device.get_type_string() == "compositive_ibutton") {
            if (para.b_read) {
                b_result = _gen_ibutton_start_io(para.server, para.device, _cb_complete_rsp, _cb_error_frame);
                if (!b_result) {
                    continue;
                }
                _set_status(para.device.get_device_index(), _type_status.ST_WAIT_READ_DATA);
            } else {
                _notifiy_received(para);
                elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
                _set_status(para.device.get_device_index(), _type_status.ST_IDLE);
            }
            return;
        }

        // error
    } while (false);

    _notifiy_error_all(n_device_index);
    elpusk.util.map_of_queue_delete(this._map_q_para, n_device_index);
    _set_status(n_device_index, _type_status.ST_IDLE);
}

/**
 * Callback complete response
 */
function _cb_complete_rsp(n_device_index: number, s_rx: Array<string> | string): void {
    do {
        const para = elpusk.util.map_of_queue_get(this._map_q_para, n_device_index);
        if (!para) {
            continue;
        }
        
        const st = _get_status(n_device_index);
        switch (st) {
            case _type_status.ST_IDLE:
                _process_rsp_event_in_idle(n_device_index);
                continue;
            case _type_status.ST_WAIT_RSP:
                _process_rsp_event_in_wait_rsp(n_device_index, s_rx);
                continue;
            case _type_status.ST_WAIT_READ_DATA:
                _process_rsp_event_in_wait_card(n_device_index, s_rx);
                continue;
            case _type_status.ST_WAIT_CANCEL:
                _process_rsp_event_in_wait_cancel(n_device_index, s_rx);
                continue;
            default:
                break;
        }
    } while (false);
}

/**
 * Callback error frame
 */
function _cb_error_frame(n_device_index: number, event_error: Error): void {
    console.log("_cb_error_frame : " + n_device_index.toString() + event_error);
    _notifiy_error_map(event_error);
    this._map_status.clear();
}

/**
 * Callback error common
 */
function _cb_error_common(n_device_index: number, event_error: Error): void {
    const parameter = elpusk.util.map_of_queue_front(this._map_q_para, n_device_index);
    if (parameter) {
        _notifiy_error(parameter, event_error);
    }
}

/**
 * Callback complete get parameter
 */
function _cb_complete_get_parameter(n_device_index: number, s_rx: Array<string> | string): void {
    let b_result = false;
    let parameter = elpusk.util.map_of_queue_front(this._map_q_para, n_device_index);
    do {
        if (parameter === null) {
            continue;
        }
        if (!parameter.device.set_rx_transaction(s_rx)) {
            continue;
        }
        if (!parameter.device.set_from_rx()) {
            continue;
        }
        
        if (typeof parameter.cb_progress === 'function') {
            parameter.stage_cur!++;
            parameter.cb_progress(n_device_index, parameter.stage_max!, parameter.stage_cur!);
        }
        
        const s_request = parameter.device.get_tx_transaction();
        if (s_request === null) {
            parameter.device.clear_transaction();
            _notifiy_received(parameter);
            parameter = null;
            b_result = true;
            continue;
        }
        
        b_result = parameter.server.device_transmit_with_callback(
            parameter.device.get_device_index(), 0, 0, s_request,
            _cb_complete_get_parameter,
            _cb_error_common,
            true
        );
        if (!b_result) {
            continue;
        }

        b_result = true;
    } while (false);

    if (parameter) {
        if (b_result) {
            elpusk.util.map_of_queue_push(this._map_q_para, n_device_index, parameter);
        } else {
            parameter.device.clear_transaction();
            _notifiy_error(parameter);
        }
    }
}

/**
 * Callback complete system info
 */
function _cb_complete_sys_info(n_device_index: number, s_rx: Array<string> | string): void {
    let b_result = false;
    let n_request = 0;
    let parameter = elpusk.util.map_of_queue_front(this._map_q_para, n_device_index);
    do {
        if (parameter === null) {
            continue;
        }
        if (!parameter.device.set_rx_transaction(s_rx)) {
            continue;
        }
        if (!parameter.device.set_from_rx()) {
            continue;
        }

        if (typeof parameter.cb_progress === 'function') {
            parameter.stage_cur!++;
            parameter.cb_progress(n_device_index, parameter.stage_max!, parameter.stage_cur!);
        }

        const s_request = parameter.device.get_tx_transaction();
        if (s_request === null) {
            n_request = _gen_get_para_start_io(parameter.server, parameter.device, _cb_complete_get_parameter, _cb_error_common);
            if (n_request <= 0) {
                console.log("E : _cb_complete_sys_info : _gen_get_para_start_io");
            } else {
                if (typeof parameter.cb_progress === 'function') {
                    parameter.stage_max = n_request;
                    parameter.stage_cur = 0;
                }
                b_result = true;
            }
            continue;
        }

        b_result = parameter.server.device_transmit_with_callback(
            parameter.device.get_device_index(), 0, 0, s_request,
            _cb_complete_sys_info,
            _cb_error_common,
            true
        );
        if (!b_result) {
            continue;
        }
        b_result = true;
    } while (false);

    if (parameter) {
        if (b_result) {
            elpusk.util.map_of_queue_push(this._map_q_para, n_device_index, parameter);
        } else {
            parameter.device.clear_transaction();
            _notifiy_error(parameter);
        }
    }
}

/**
 * Callback complete system info only
 */
function _cb_complete_sys_info_only(n_device_index: number, s_rx: Array<string> | string): void {
    let b_result = false;
    let parameter = elpusk.util.map_of_queue_front(this._map_q_para, n_device_index);
    do {
        if (parameter === null) {
            continue;
        }
        if (!parameter.device.set_rx_transaction(s_rx)) {
            continue;
        }
        if (!parameter.device.set_from_rx()) {
            continue;
        }

        if (typeof parameter.cb_progress === 'function') {
            parameter.stage_cur!++;
            parameter.cb_progress(n_device_index, parameter.stage_max!, parameter.stage_cur!);
        }

        const s_request = parameter.device.get_tx_transaction();
        if (s_request === null) {
            parameter.device.clear_transaction();
            _notifiy_received(parameter);
            parameter = null;
            b_result = true;
            continue;
        }

        b_result = parameter.server.device_transmit_with_callback(
            parameter.device.get_device_index(), 0, 0, s_request,
            _cb_complete_sys_info_only,
            _cb_error_common,
            true
        );
        if (!b_result) {
            continue;
        }
        b_result = true;
    } while (false);

    if (parameter) {
        if (b_result) {
            elpusk.util.map_of_queue_push(this._map_q_para, n_device_index, parameter);
        } else {
            parameter.device.clear_transaction();
            _notifiy_error(parameter);
        }
    }
}    




}// the end of ctl_lpu237 class




/**
 * Callback complete set parameter
 */
function _cb_complete_set_parameter(n_device_index: number, s_rx: Array<string> | string): void {
    let b